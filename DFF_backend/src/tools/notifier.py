import os

import requests
from dotenv import load_dotenv
from supabase_client import supabase

load_dotenv()

EXPO_PUSH_URL = "https://exp.host/--/expoapi/v2/push/send"


def _user_matches_event(user: dict, tags: dict) -> bool:
    """Return True if the event's dietary tags satisfy this user's preferences.

    If the event has no dietary tags it goes to everyone.
    If the user has no dietary preferences they receive all events.
    Otherwise every preference the user has must be satisfied by the event.
    """
    event_has_tags = tags.get("is_halal") or tags.get("is_vegan") or tags.get("is_vegetarian")
    user_has_prefs = user.get("halal") or user.get("vegan") or user.get("vegetarian")

    if not event_has_tags or not user_has_prefs:
        return True

    if user.get("halal") and not tags.get("is_halal"):
        return False
    if user.get("vegan") and not tags.get("is_vegan"):
        return False
    if user.get("vegetarian") and not tags.get("is_vegetarian"):
        return False

    return True


class Notifier:
    def send_noti(self, title: str, body: str, tags: dict | None = None):
        if tags is None:
            tags = {"is_halal": False, "is_vegan": False, "is_vegetarian": False}

        users = (
            supabase.table("Users")
            .select("id, halal, vegan, vegetarian")
            .eq("notifications", True)
            .execute()
        )

        matching_ids = [u["id"] for u in users.data if _user_matches_event(u, tags)]

        if not matching_ids:
            print("No matching users for this notification")
            return

        subs = (
            supabase.table("push_subscriptions")
            .select("expo_push_token")
            .in_("user_id", matching_ids)
            .execute()
        )

        tokens = [s["expo_push_token"] for s in subs.data if s.get("expo_push_token")]
        if not tokens:
            print("No push tokens found")
            return

        messages = [
            {"to": token, "title": title, "body": body, "sound": "default"}
            for token in tokens
        ]

        resp = requests.post(
            EXPO_PUSH_URL,
            json=messages,
            headers={
                "Accept": "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
        )

        if resp.status_code != 200:
            print(f"Expo push failed ({resp.status_code}): {resp.text}")
        else:
            print(f"Sent notifications to {len(tokens)} device(s)")
