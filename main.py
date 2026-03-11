from src.scraper import Scraper

scraper = Scraper()
links = scraper.scrape()
print(links)