import os
from pathlib import Path

from src.analyzer import Analyzer
from src.formatter import Formatter
from src.notifier import Notifier
from src.scraper import DragonLinkScraper
from src.updater import Updater

BASE_DIR = Path(__file__).resolve().parent
SEEN_EVENTS_PATH = BASE_DIR / "seen_events.txt"

with open(SEEN_EVENTS_PATH, "r", encoding="utf-8") as file:
    seen_events = file.read()

if __name__ == "__main__":
    scraper = DragonLinkScraper()
    analyzer = Analyzer()
    formatter = Formatter()
    notifier = Notifier()
    updater = Updater()

    updater.clear_already_happened()

    links, times, locations, date_infos = scraper.fetch_valid_events()

    with open("seen_events.txt", "r", encoding="utf-8") as file:
        seen_events = file.read()

    os.system("cls")

    print("getting and checking descriptions")

    count = 0

    if links is not None:
        for i in range(len(links)):
            print(f"{i}/{len(links)}")
            count += 1

            date_info = date_infos[i]
            month = date_info[0]
            day_of_month = date_info[1]

            seen_events += f"{links[i]}\n{month} {day_of_month}\n"

            description = scraper.get_description(links[i])
            if description != f"Could not find description for {links[i]}":
                isFood = analyzer.is_free_food(description)

                if isFood == "TRUE":
                    time = times[i]
                    location = locations[i]

                    formatted_message = formatter.format_message(
                        description, time, location
                    )

                    notifier.send_noti("EVENT", formatted_message)

    with open("seen_events.txt", "w", encoding="utf-8") as file:
        file.write(seen_events)

    DragonLinkScraper.close()
