import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class Formatter:
    def __init__(self):
        api_key = os.getenv("GPT_API_KEY")
        self.client = OpenAI(api_key=api_key)

    def format_message(self, description, time, location):
        """Return a dict: {title, date, time, location, food_offered}."""
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful assistant. Extract and return a JSON object with these keys:\n"
                            "- title: concise event name\n"
                            "- date: date as 'Month Day' (e.g. 'April 29')\n"
                            "- time: start time (e.g. '2:00 PM')\n"
                            "- location: building and room\n"
                            "- food_offered: brief description of the food available\n"
                            "Return only the JSON object, nothing else. Keep values concise."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"Event Description: {description}, Event Time: {time}, Location: {location}",
                    },
                ],
                max_tokens=120,
                temperature=0,
            )

            import json
            raw = response.choices[0].message.content.strip()
            data = json.loads(raw)
            return {
                "title": data.get("title", "Free Food Event"),
                "date": data.get("date", ""),
                "time": data.get("time", time),
                "location": data.get("location", location),
                "food_offered": data.get("food_offered", ""),
            }

        except Exception as e:
            print(f"Formatter Error calling OpenAI: {e}")
            return {"title": "Free Food Event", "date": "", "time": time, "location": location, "food_offered": ""}
