"""Where ffmpeg pushes to. The key is read here and nowhere else, and never printed."""
import glob
import json
import os
import re
from pathlib import Path

DEFAULT_SERVER = "rtmp://live.twitch.tv/app"
SERVICE_GLOB = "/mnt/c/Users/*/AppData/Roaming/obs-studio/basic/profiles/TSD_with_Jon/service.json"


def service_path():
    env = os.environ.get("BWV_SERVICE_JSON")
    if env:
        return Path(env).expanduser()
    hits = glob.glob(SERVICE_GLOB)
    return Path(hits[0]) if hits else None


def load(bandwidthtest=False):
    p = service_path()
    if not p or not p.exists():
        raise SystemExit("no OBS service file found (set BWV_SERVICE_JSON)")
    s = json.loads(p.read_text()).get("settings", {})
    key = s.get("key", "")
    if not key:
        raise SystemExit("the OBS profile holds no stream key")
    server = s.get("server") or DEFAULT_SERVER
    if "twitch.tv" not in server:
        server = DEFAULT_SERVER  # "auto" and the like
    server = server.rstrip("/")
    secret = key + ("?bandwidthtest=true" if bandwidthtest else "")
    return f"{server}/{secret}", key


def redact(text, key):
    text = re.sub(r"rtmps?://[^\s'\"]+", "rtmp://<ingest redacted>", text)
    return text.replace(key, "<key>") if key else text
