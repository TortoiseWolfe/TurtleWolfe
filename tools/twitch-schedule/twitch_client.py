#!/usr/bin/env python3
"""Twitch Helix API client — stdlib only, no pip dependencies.

Usage (from the repo root, Docker-first):  docker compose run --rm twitch <command> <subcommand> [--opts]
    python3 twitch_client.py auth device        # one-time sign-in with our own app (device code flow)
    python3 twitch_client.py channel info
    python3 twitch_client.py channel update --title "Stream Title" --game "Software and Game Development"
    python3 twitch_client.py schedule get
    python3 twitch_client.py schedule create --title "Stream" --start "2026-04-01T19:00:00-04:00" --duration 90
    python3 twitch_client.py schedule update --segment-id "abc123" --title "New Title"
    python3 twitch_client.py schedule delete --segment-id "abc123"
    python3 twitch_client.py categories search --query "Software"
"""

import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

HELIX_BASE = "https://api.twitch.tv/helix"
TOKEN_URL = "https://id.twitch.tv/oauth2/token"
DEVICE_URL = "https://id.twitch.tv/oauth2/device"
# Only what the schedule and title commands need. Tokens are minted with OUR app
# ("TurtleWolfe Schedule Manager"), never on a third-party token site.
SCOPES = "channel:manage:schedule channel:manage:broadcast"


def find_env_file():
    """Walk up from script location to find .env file."""
    path = Path(__file__).resolve().parent
    for _ in range(10):
        env_path = path / ".env"
        if env_path.exists():
            return env_path
        parent = path.parent
        if parent == path:
            break
        path = parent
    return None


def load_env(env_path):
    """Parse .env file into dict. Handles $$ escaping and comments."""
    env = {}
    if not env_path or not env_path.exists():
        return env
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip()
            # Remove surrounding quotes
            if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
                value = value[1:-1]
            # Handle $$ escaping (Docker Compose convention)
            value = value.replace("$$", "$")
            env[key] = value
    return env


def update_env_value(env_path, key, new_value):
    """Update a single key in the .env file, preserving all other content."""
    lines = env_path.read_text().splitlines(keepends=True)
    updated = False
    new_lines = []
    pattern = re.compile(rf"^{re.escape(key)}\s*=")
    for line in lines:
        if pattern.match(line.strip()):
            new_lines.append(f"{key}={new_value}\n")
            updated = True
        else:
            new_lines.append(line)
    if not updated:
        new_lines.append(f"{key}={new_value}\n")
    # Atomic write via temp file + rename
    fd, tmp = tempfile.mkstemp(dir=env_path.parent, suffix=".env.tmp")
    try:
        with os.fdopen(fd, "w") as f:
            f.writelines(new_lines)
        os.replace(tmp, env_path)
    except Exception:
        os.unlink(tmp)
        raise


class TwitchClient:
    def __init__(self):
        self.env_path = find_env_file()
        env = load_env(self.env_path)
        self.client_id = env.get("TWITCH_CLIENT_ID", "")
        self.client_secret = env.get("TWITCH_CLIENT_SECRET", "")
        self.access_token = env.get("TWITCH_ACCESS_TOKEN", "")
        self.refresh_token = env.get("TWITCH_REFRESH_TOKEN", "")
        self.broadcaster_id = env.get("TWITCH_BROADCASTER_ID", "")

        if not self.client_id or not self.access_token:
            print("Error: TWITCH_CLIENT_ID and TWITCH_ACCESS_TOKEN must be set in .env", file=sys.stderr)
            print("Run `docker compose run --rm twitch auth device` (see tools/twitch-schedule/README.md).", file=sys.stderr)
            sys.exit(1)

    def _request(self, method, url, data=None):
        """Make an authenticated Helix API request."""
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Client-Id": self.client_id,
            "Content-Type": "application/json",
        }
        body = json.dumps(data).encode() if data else None
        req = Request(url, data=body, headers=headers, method=method)
        with urlopen(req) as resp:
            content = resp.read().decode()
            if content:
                return json.loads(content)
            return None

    def _refresh_access_token(self):
        """Refresh the OAuth token and update .env."""
        if not self.refresh_token or not self.client_secret:
            print("Error: Cannot refresh token — TWITCH_REFRESH_TOKEN and TWITCH_CLIENT_SECRET required.", file=sys.stderr)
            sys.exit(1)

        params = urlencode({
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token,
        }).encode()

        req = Request(TOKEN_URL, data=params, method="POST")
        with urlopen(req) as resp:
            result = json.loads(resp.read().decode())

        self.access_token = result["access_token"]
        if "refresh_token" in result:
            self.refresh_token = result["refresh_token"]

        # Persist new tokens to .env
        if self.env_path:
            update_env_value(self.env_path, "TWITCH_ACCESS_TOKEN", self.access_token)
            if "refresh_token" in result:
                update_env_value(self.env_path, "TWITCH_REFRESH_TOKEN", self.refresh_token)

        print("Token refreshed successfully.", file=sys.stderr)

    def request(self, method, url, data=None):
        """Make a request with automatic token refresh on 401."""
        try:
            return self._request(method, url, data)
        except HTTPError as e:
            if e.code == 401 and self.refresh_token:
                self._refresh_access_token()
                return self._request(method, url, data)
            raise

    # --- Channel ---

    def get_channel_info(self):
        url = f"{HELIX_BASE}/channels?broadcaster_id={self.broadcaster_id}"
        return self.request("GET", url)

    def update_channel(self, title=None, game_id=None):
        url = f"{HELIX_BASE}/channels?broadcaster_id={self.broadcaster_id}"
        data = {}
        if title is not None:
            data["title"] = title
        if game_id is not None:
            data["game_id"] = game_id
        if not data:
            print("Error: --title or --game required", file=sys.stderr)
            sys.exit(1)
        return self.request("PATCH", url, data)

    # --- Categories ---

    def search_categories(self, query):
        url = f"{HELIX_BASE}/search/categories?{urlencode({'query': query})}"
        return self.request("GET", url)

    def resolve_game_id(self, game_name):
        """Search for a category and return the game_id of the best match."""
        result = self.search_categories(game_name)
        if not result or not result.get("data"):
            print(f"Error: No category found for '{game_name}'", file=sys.stderr)
            sys.exit(1)
        # Prefer exact match
        for cat in result["data"]:
            if cat["name"].lower() == game_name.lower():
                return cat["id"]
        # Fall back to first result
        chosen = result["data"][0]
        print(f"Using closest match: {chosen['name']} (id: {chosen['id']})", file=sys.stderr)
        return chosen["id"]

    # --- Schedule ---

    def get_schedule(self):
        url = f"{HELIX_BASE}/schedule?broadcaster_id={self.broadcaster_id}"
        return self.request("GET", url)

    def create_schedule_segment(self, start_time, duration, title, category_id=None,
                                 is_recurring=False, timezone_str="America/New_York"):
        url = f"{HELIX_BASE}/schedule/segment?broadcaster_id={self.broadcaster_id}"
        data = {
            "start_time": start_time,
            "timezone": timezone_str,
            "duration": str(duration),
            "title": title[:140],
            "is_recurring": is_recurring,
        }
        if category_id:
            data["category_id"] = category_id
        return self.request("POST", url, data)

    def update_schedule_segment(self, segment_id, **kwargs):
        url = f"{HELIX_BASE}/schedule/segment?broadcaster_id={self.broadcaster_id}&id={segment_id}"
        data = {}
        if "title" in kwargs:
            data["title"] = kwargs["title"][:140]
        if "duration" in kwargs:
            data["duration"] = str(kwargs["duration"])
        if "category_id" in kwargs:
            data["category_id"] = kwargs["category_id"]
        if "is_canceled" in kwargs:
            data["is_canceled"] = kwargs["is_canceled"]
        return self.request("PATCH", url, data)

    def delete_schedule_segment(self, segment_id):
        url = f"{HELIX_BASE}/schedule/segment?broadcaster_id={self.broadcaster_id}&id={segment_id}"
        return self.request("DELETE", url)


def device_login():
    """Mint a channel token with Twitch's device code flow and save it to .env.

    Prints only the link and the short code the owner approves; the tokens themselves
    go straight into .env and are never printed.
    """
    import time

    env_path = find_env_file()
    env = load_env(env_path)
    client_id = env.get("TWITCH_CLIENT_ID", "")
    client_secret = env.get("TWITCH_CLIENT_SECRET", "")
    if not env_path or not client_id:
        print("Error: TWITCH_CLIENT_ID must be set in .env first.", file=sys.stderr)
        sys.exit(1)

    with urlopen(Request(DEVICE_URL, data=urlencode({"client_id": client_id, "scopes": SCOPES}).encode(),
                         method="POST")) as resp:
        start = json.loads(resp.read().decode())

    print(f"Open {start['verification_uri']} signed in as TurtleWolfe and approve code {start['user_code']}.",
          file=sys.stderr)
    interval = int(start.get("interval", 5))
    deadline = time.time() + int(start.get("expires_in", 1800))
    poll = {
        "client_id": client_id,
        "scopes": SCOPES,
        "device_code": start["device_code"],
        "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
    }
    if client_secret:  # confidential app: Twitch expects the secret on the token request
        poll["client_secret"] = client_secret

    while time.time() < deadline:
        time.sleep(interval)
        try:
            with urlopen(Request(TOKEN_URL, data=urlencode(poll).encode(), method="POST")) as resp:
                tokens = json.loads(resp.read().decode())
            break
        except HTTPError as e:
            message = json.loads(e.read().decode() or "{}").get("message", "")
            if message == "authorization_pending":
                continue
            if message == "slow_down":
                interval += 5
                continue
            print(f"Error: device login failed ({e.code} {message}).", file=sys.stderr)
            sys.exit(1)
    else:
        print("Error: the code expired before it was approved. Run it again.", file=sys.stderr)
        sys.exit(1)

    update_env_value(env_path, "TWITCH_ACCESS_TOKEN", tokens["access_token"])
    update_env_value(env_path, "TWITCH_REFRESH_TOKEN", tokens["refresh_token"])
    if not env.get("TWITCH_BROADCASTER_ID"):
        req = Request(f"{HELIX_BASE}/users", headers={
            "Authorization": f"Bearer {tokens['access_token']}", "Client-Id": client_id})
        with urlopen(req) as resp:
            update_env_value(env_path, "TWITCH_BROADCASTER_ID", json.loads(resp.read().decode())["data"][0]["id"])
    print("Signed in. Tokens saved to .env (not shown).", file=sys.stderr)


def parse_args(args):
    """Parse --key value pairs from args list into dict."""
    parsed = {}
    i = 0
    while i < len(args):
        if args[i].startswith("--"):
            key = args[i][2:]
            if i + 1 < len(args) and not args[i + 1].startswith("--"):
                parsed[key] = args[i + 1]
                i += 2
            else:
                parsed[key] = True
                i += 1
        else:
            i += 1
    return parsed


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]
    subcommand = sys.argv[2]
    opts = parse_args(sys.argv[3:])

    if (command, subcommand) == ("auth", "device"):
        device_login()
        return

    client = TwitchClient()

    if command == "channel":
        if subcommand == "info":
            result = client.get_channel_info()
            print(json.dumps(result, indent=2))

        elif subcommand == "update":
            game_id = None
            if "game" in opts:
                game_id = client.resolve_game_id(opts["game"])
            result = client.update_channel(
                title=opts.get("title"),
                game_id=game_id,
            )
            if result is None:
                print('{"status": "updated"}')
            else:
                print(json.dumps(result, indent=2))
        else:
            print(f"Unknown channel subcommand: {subcommand}", file=sys.stderr)
            sys.exit(1)

    elif command == "schedule":
        if subcommand == "get":
            result = client.get_schedule()
            print(json.dumps(result, indent=2))

        elif subcommand == "create":
            for required in ("title", "start", "duration"):
                if required not in opts:
                    print(f"Error: --{required} is required", file=sys.stderr)
                    sys.exit(1)
            category_id = None
            if "category" in opts:
                category_id = client.resolve_game_id(opts["category"])
            result = client.create_schedule_segment(
                start_time=opts["start"],
                duration=int(opts["duration"]),
                title=opts["title"],
                category_id=category_id,
                is_recurring="recurring" in opts,
                timezone_str=opts.get("timezone", "America/New_York"),
            )
            print(json.dumps(result, indent=2))

        elif subcommand == "update":
            if "segment-id" not in opts:
                print("Error: --segment-id is required", file=sys.stderr)
                sys.exit(1)
            kwargs = {}
            if "title" in opts:
                kwargs["title"] = opts["title"]
            if "duration" in opts:
                kwargs["duration"] = int(opts["duration"])
            if "category" in opts:
                kwargs["category_id"] = client.resolve_game_id(opts["category"])
            if "cancel" in opts:
                kwargs["is_canceled"] = True
            result = client.update_schedule_segment(opts["segment-id"], **kwargs)
            if result is None:
                print('{"status": "updated"}')
            else:
                print(json.dumps(result, indent=2))

        elif subcommand == "delete":
            if "segment-id" not in opts:
                print("Error: --segment-id is required", file=sys.stderr)
                sys.exit(1)
            client.delete_schedule_segment(opts["segment-id"])
            print('{"status": "deleted"}')

        else:
            print(f"Unknown schedule subcommand: {subcommand}", file=sys.stderr)
            sys.exit(1)

    elif command == "categories":
        if subcommand == "search":
            if "query" not in opts:
                print("Error: --query is required", file=sys.stderr)
                sys.exit(1)
            result = client.search_categories(opts["query"])
            print(json.dumps(result, indent=2))
        else:
            print(f"Unknown categories subcommand: {subcommand}", file=sys.stderr)
            sys.exit(1)

    else:
        print(f"Unknown command: {command}", file=sys.stderr)
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
