import datetime
import os
import time

import schedule

from src.tools.analyzer import Analyzer
from src.tools.formatter import Formatter
from src.tools.notifier import Notifier
from src.tools.scraper import DragonLinkScraper
from src.tools.updater import Updater
from supabase_client import supabase


def run_cleanup():
    print(f"[{datetime.datetime.now()}] Running daily cleanup...")
    updater = Updater()
    updater.clear_already_happened()
    print("Cleanup done.")


def run_scraper():
    print(f"[{datetime.datetime.now()}] Running scraper...")
    scraper = DragonLinkScraper()
    analyzer = Analyzer()
    formatter = Formatter()
    notifier = Notifier()

    try:
        links, times, locations, date_infos = scraper.fetch_valid_events()

        os.system("cls" if os.name == "nt" else "clear")
        print("Getting and checking descriptions...")

        if links is not None:
            for i in range(len(links)):
                print(f"{i + 1}/{len(links)}")

                date_info = date_infos[i]
                month = date_info[0]
                day_of_month = date_info[1]

                today = datetime.date.today()
                event_date = datetime.date(today.year, month, day_of_month)

                supabase.table("seen_events").upsert(
                    {"link": links[i], "event_date": event_date.isoformat()},
                    on_conflict="link",
                ).execute()

                description = scraper.get_description(links[i])
                if description != f"Could not find description for {links[i]}":
                    analysis = analyzer.is_free_food(description)

                    if analysis["is_food"]:
                        formatted = formatter.format_message(
                            description, times[i], locations[i]
                        )

                        tags = {
                            "is_halal": analysis["is_halal"],
                            "is_vegan": analysis["is_vegan"],
                            "is_vegetarian": analysis["is_vegetarian"],
                        }

                        supabase.table("events").upsert(
                            {
                                "title": formatted["title"],
                                "date": formatted["date"],
                                "time": formatted["time"],
                                "location": formatted["location"],
                                "description": description,
                                "food_offered": formatted["food_offered"],
                                "link": links[i],
                                "event_date": event_date.isoformat(),
                                **tags,
                            },
                            on_conflict="link",
                        ).execute()

                        notifier.send_noti(
                            formatted["title"],
                            f"{formatted['food_offered']} — {formatted['location']}",
                            tags,
                        )

        print("Scraper run complete.")
    finally:
        scraper.close()


if __name__ == "__main__":
    # Run both immediately on startup
    run_cleanup()
    run_scraper()

    # Cleanup once a day at midnight; scraper runs every hour to catch new postings
    schedule.every().day.at("00:00").do(run_cleanup)
    schedule.every(1).hours.do(run_scraper)

    print("Scheduler running. Press Ctrl+C to stop.")
    while True:
        schedule.run_pending()
        time.sleep(60)
