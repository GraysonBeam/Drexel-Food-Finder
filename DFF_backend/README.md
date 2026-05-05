🐲 DragonLink Food Finder

An automated event scraper for Drexel's DragonLink portal that uses AI to detect free food and sends instant mobile alerts.

🚀 How it Works

- Scrape: Uses Selenium to navigate the dynamic DragonLink Events page, handling infinite scroll to find all upcoming events.
- Analyze: Passes event descriptions to the OpenAI GPT API.
- Detect: The AI parses the text to determine if free food is offered (filtering out false positives like "food for thought").
- Alert: If food is found, a push notification is sent directly to your phone via PHP Mailer Notification

🛠️ Tech Stack

- Language: Python 3.x
- Automation: Selenium WebDriver (Chrome)
- Intelligence: OpenAI API (GPT-4o-mini)
- Notifications: Pushbullet API
