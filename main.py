from src.analyzer import Analyzer
from src.formatter import Formatter
from src.scraper import DragonLinkScraper

scraper = DragonLinkScraper()
analyzer = Analyzer()
formatter = Formatter()

links, times, locations = scraper.fetch_valid_events()

for i in range(len(links)):
    description = scraper.get_description(links[i])
    if description is not f"Could not find description for {links[i]}":
        isFood = analyzer.is_free_food(description)
        if isFood == "TRUE":
            time = times[i]
            location = locations[i]
            formatted_message = formatter.format_message(description, time, location)
            print(formatted_message, "\n")
