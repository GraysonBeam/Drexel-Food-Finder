"""
Backend helpers for reading and updating user preferences in Supabase.
Called from the Python scraper context; the React frontend uses supabase-js directly.
"""
from supabase_client import supabase

VALID_FIELDS = {"notifications", "vegetarian", "vegan", "halal"}


def update_preference(user_id: str, field: str, value: bool) -> bool:
    """Update a single preference field on a Users row. Returns True on success."""
    if field not in VALID_FIELDS:
        raise ValueError(f"Invalid preference field '{field}'. Must be one of {VALID_FIELDS}")

    result = supabase.table("Users").update({field: value}).eq("id", user_id).execute()
    return len(result.data) > 0


def get_preferences(user_id: str) -> dict | None:
    """Return the preference fields for a user, or None if not found."""
    result = (
        supabase.table("Users")
        .select("id, first_name, last_name, notifications, vegetarian, vegan, halal")
        .eq("id", user_id)
        .execute()
    )
    return result.data[0] if result.data else None
