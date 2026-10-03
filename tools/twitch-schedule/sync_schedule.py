#!/usr/bin/env python3
"""Sync schedule.md to Twitch channel schedule.

Usage:
    python3 sync_schedule.py              # dry-run (show what would change)
    python3 sync_schedule.py --apply      # actually sync to Twitch
    python3 sync_schedule.py --clear      # delete all existing segments first
"""

import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Import the client from the same directory
sys.path.insert(0, str(Path(__file__).resolve().parent))
from twitch_client import TwitchClient


def parse_schedule_md(path):
    """Parse schedule.md into a list of stream entries."""
    text = Path(path).read_text()
    entries = []
    # Split on H2 headers
    sections = re.split(r"^## ", text, flags=re.MULTILINE)[1:]

    for section in sections:
        lines = section.strip().split("\n")
        name = lines[0].strip()
        entry = {"name": name}

        for line in lines[1:]:
            line = line.strip()
            match = re.match(r"-\s*\*\*(\w+):\*\*\s*(.+)", line)
            if match:
                key = match.group(1).lower()
                value = match.group(2).strip()
                entry[key] = value

        # Validate required fields
        if "start" not in entry or "title" not in entry:
            print(f"Warning: Skipping '{name}' — missing Start or Title", file=sys.stderr)
            continue

        entry.setdefault("duration", "60")
        entry.setdefault("recurring", "none")
        entries.append(entry)

    return entries


def parse_iso_datetime(s):
    """Parse ISO 8601 datetime string to UTC datetime."""
    # Python 3.11+ handles fromisoformat with timezone offsets
    dt = datetime.fromisoformat(s)
    return dt.astimezone(timezone.utc)


def times_match(local_str, remote_str, tolerance_minutes=5):
    """Check if two ISO timestamps are within tolerance."""
    try:
        local_dt = parse_iso_datetime(local_str)
        remote_dt = parse_iso_datetime(remote_str)
        return abs((local_dt - remote_dt).total_seconds()) < tolerance_minutes * 60
    except (ValueError, TypeError):
        return False


def diff_schedule(local_entries, remote_segments):
    """Compare local schedule.md entries against Twitch schedule segments.

    Returns (to_create, to_update, to_delete) lists.
    """
    to_create = []
    to_update = []
    to_delete = []

    remote_matched = set()

    for entry in local_entries:
        matched = False
        for seg in remote_segments:
            seg_start = seg.get("start_time", "")
            if times_match(entry["start"], seg_start):
                remote_matched.add(seg["id"])
                # Check if title differs
                if seg.get("title", "") != entry["title"][:140]:
                    to_update.append({"segment_id": seg["id"], "entry": entry, "current": seg})
                matched = True
                break
        if not matched:
            to_create.append(entry)

    for seg in remote_segments:
        if seg["id"] not in remote_matched:
            to_delete.append(seg)

    return to_create, to_update, to_delete


def main():
    apply_changes = "--apply" in sys.argv
    clear_first = "--clear" in sys.argv

    schedule_path = Path(__file__).resolve().parent / "schedule.md"
    if not schedule_path.exists():
        print(f"Error: {schedule_path} not found", file=sys.stderr)
        sys.exit(1)

    local_entries = parse_schedule_md(schedule_path)
    print(f"Parsed {len(local_entries)} entries from schedule.md\n")

    client = TwitchClient()

    # Get current Twitch schedule
    remote = client.get_schedule()
    remote_segments = []
    if remote and "data" in remote and "segments" in remote["data"]:
        remote_segments = remote["data"]["segments"] or []
    print(f"Found {len(remote_segments)} segments on Twitch\n")

    if clear_first and apply_changes:
        print("Clearing all existing segments...")
        for seg in remote_segments:
            client.delete_schedule_segment(seg["id"])
            print(f"  Deleted: {seg.get('title', 'untitled')} ({seg['id']})")
        remote_segments = []
        print()

    to_create, to_update, to_delete = diff_schedule(local_entries, remote_segments)

    # Show diff
    if to_create:
        print("CREATE:")
        for entry in to_create:
            print(f"  + {entry['title']} @ {entry['start']} ({entry['duration']}min)")
    if to_update:
        print("UPDATE:")
        for item in to_update:
            print(f"  ~ {item['current']['title']} -> {item['entry']['title']}")
    if to_delete:
        print("DELETE (on Twitch but not in schedule.md):")
        for seg in to_delete:
            print(f"  - {seg.get('title', 'untitled')} ({seg['id']})")

    if not to_create and not to_update and not to_delete:
        print("Schedule is in sync.")
        return

    if not apply_changes:
        print(f"\nDry run — {len(to_create)} to create, {len(to_update)} to update, {len(to_delete)} to delete.")
        print("Run with --apply to push changes to Twitch.")
        return

    # Apply changes
    print("\nApplying changes...")

    for entry in to_create:
        category_id = None
        if "category" in entry:
            category_id = client.resolve_game_id(entry["category"])
        result = client.create_schedule_segment(
            start_time=entry["start"],
            duration=int(entry["duration"]),
            title=entry["title"],
            category_id=category_id,
            is_recurring=entry.get("recurring", "none").lower() == "weekly",
        )
        print(f"  Created: {entry['title']}")

    for item in to_update:
        kwargs = {"title": item["entry"]["title"]}
        if "duration" in item["entry"]:
            kwargs["duration"] = int(item["entry"]["duration"])
        if "category" in item["entry"]:
            kwargs["category_id"] = client.resolve_game_id(item["entry"]["category"])
        client.update_schedule_segment(item["segment_id"], **kwargs)
        print(f"  Updated: {item['entry']['title']}")

    for seg in to_delete:
        client.delete_schedule_segment(seg["id"])
        print(f"  Deleted: {seg.get('title', 'untitled')}")

    print(f"\nDone. {len(to_create)} created, {len(to_update)} updated, {len(to_delete)} deleted.")


if __name__ == "__main__":
    main()
