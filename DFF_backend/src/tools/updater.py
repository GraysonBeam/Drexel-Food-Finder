import datetime

from supabase_client import supabase


class Updater:
    def clear_already_happened(self):
        today = datetime.date.today().isoformat()

        supabase.table("events").delete().lt("event_date", today).execute()
        print(f"Deleted events before {today}")

        supabase.table("seen_events").delete().lt("event_date", today).execute()
        print(f"Deleted seen_events before {today}")
