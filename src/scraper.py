import datetime
import os
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

DATE = datetime.datetime.now()


class DragonLinkScraper:
    def __init__(self):
        # use headless mode to avoid opening a browser window
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")

        # This line automatically finds the right Chrome driver for your computer
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.base_url = "https://dragonlink.drexel.edu"

    def fetch_valid_events(self):
        self.driver.get(f"{self.base_url}/events")

        count = 0
        while True:
            try:
                os.system("cls")
                print(f"loading links {count}-{count + 15}")
                # Look for a button containing the text 'Load More'
                # WebDriverWait tells the code 'don't crash, just wait 5 seconds'
                load_more_button = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable(
                        (By.XPATH, "//button[contains(., 'Load More')]")
                    )
                )

                # Use JavaScript to scroll the button into the center of the view.
                self.driver.execute_script(
                    "arguments[0].scrollIntoView();", load_more_button
                )
                time.sleep(1)  # Give the browser a heartbeat to settle

                load_more_button.click()
                count += 15

                time.sleep(2)

            except Exception:
                # If the button isn't found within 5 seconds, we assume we hit the end
                print("No more 'Load More' button found. List is fully expanded.")
                break

        os.system("cls")

        # Use a CSS Selector: 'div#eventdiscoverylist a' means 'all links inside that ID'
        cards = self.driver.find_elements(By.CSS_SELECTOR, "div#event-discovery-list a")

        return self.get_valid_links(cards)

    def get_valid_links(self, cards):
        # returns links of events that haven't already happened

        links = []
        times = []
        locations = []

        for card in cards:
            try:
                # Search each card for the elements marked as aria-labels, those are dates and locations
                # Use the [aria-label] selector because it's an attribute
                aria_elements = card.find_elements(By.CSS_SELECTOR, "div[aria-label]")
                date_element = aria_elements[0]
                location_element = aria_elements[1]

                # Grab the text inside that attribute
                date_text = date_element.get_attribute("aria-label")
                location_text = location_element.get_attribute("aria-label")

                date_text = date_text[
                    13:
                ]  # gets rid of "happening on " at the beginning of the string
                times.append(date_text)

                location_text = location_text[
                    11:
                ]  # gets rid of "located at " at the beginning
                locations.append(location_text)

                date_text = date_text.split(
                    ","
                )  # This should give us something like ['Monday', ' January 1 at 12:00AM EDT']

                day = date_text[0].strip()  # 'Monday'

                month_day_year = date_text[1][1:].split(
                    " "
                )  # ['January', '1', 'at', '12:00AM', 'EDT']

                day = DAYS.index(day) + 1  # Convert 'Monday' to 1, 'Tuesday' to 2, etc.

                month = (
                    MONTHS.index(month_day_year[0]) + 1
                )  # Convert 'January' to 1, 'February' to 2, etc.

                day_of_month = int(month_day_year[1])  # Convert '1' to 1

                # Now you can use Python's 'datetime' library to see if
                # that date is before or after 'today'.
                if DATE.month > month or (
                    DATE.month == month and DATE.day > day_of_month
                ):
                    # This event has already happened, so we skip it
                    continue

                # Pull the 'href' (the URL) from each card
                # We only keep it if it has '/event/' in the link to avoid trash links
                links.append(
                    card.get_attribute("href")
                ) if "/event/" in card.get_attribute("href") else None

            except Exception:
                # Some cards might be formatted differently; this prevents a crash
                continue

        # set() removes duplicates
        return list(set(links)), times, locations

    def get_description(self, link):
        self.driver.get(link)

        # Single Page Apps like DragonLink take a second to 'pop' the text in.
        try:
            # Search for the div with class 'descriptionText'
            # then find the 'p' tag inside it.
            #
            # even though descriptionText is buried underneath a lot of different divs, we can
            # still search for it directly instead of having to navigate to its div
            description_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "div.DescriptionText p")
                )
            )

            # Extract the clean text
            text_content = description_element.text

            return text_content

        except Exception:
            return f"Could not find description for {link}"

    def close(self):
        self.driver.quit()
