import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class DragonLinkScraper:
    def __init__(self):
        #use headless mode to avoid opening a browser window
        options = webdriver.ChromeOptions()
        options.add_argument("--headless") 
        
        # This line automatically finds the right Chrome driver for your computer
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.base_url = "https://dragonlink.drexel.edu"

    def fetch_all_event_urls(self):
        self.driver.get(f"{self.base_url}/events")
        
        while True:
            try:
                # Look for a button containing the text 'Load More'
                # WebDriverWait tells the code 'don't crash, just wait 5 seconds'
                load_more_button = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Load More')]"))
                )

                # Use JavaScript to scroll the button into the center of the view.
                self.driver.execute_script("arguments[0].scrollIntoView();", load_more_button)
                time.sleep(1) # Give the browser a heartbeat to settle
                
                load_more_button.click()
                
                time.sleep(2) 

            except Exception:
                # If the button isn't found within 5 seconds, we assume we hit the end
                print("No more 'Load More' button found. List is fully expanded.")
                break

        # Use a CSS Selector: 'div#eventdiscoverylist a' means 'all links inside that ID'
        cards = self.driver.find_elements(By.CSS_SELECTOR, "div#eventdiscoverylist a")
        
        # Use a list comprehension to pull the 'href' (the URL) from each card
        # We only keep it if it has '/event/' in the link to avoid trash links
        links = [c.get_attribute("href") for c in cards if "/event/" in str(c.get_attribute("href"))]
        
        # set() removes duplicates
        return list(set(links))

    def close(self):
        self.driver.quit()
