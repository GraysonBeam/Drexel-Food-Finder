import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class Analyzer:
    def __init__(self):
        api_key = os.getenv("GPT_API_KEY")
        self.client = OpenAI(api_key=api_key)

    def is_free_food(self, description):
        """Return a dict: {is_food, is_halal, is_vegan, is_vegetarian}."""
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful assistant. Analyze the event description and return "
                            "a JSON object with exactly these boolean keys:\n"
                            "- is_food: true if the event provides substantial free food (not just drinks/small snacks)\n"
                            "- is_halal: true if the food is explicitly halal\n"
                            "- is_vegan: true if the food is explicitly vegan\n"
                            "- is_vegetarian: true if the food is vegetarian or vegan\n"
                            "Return only the JSON object, nothing else."
                        ),
                    },
                    {"role": "user", "content": f"Event Description: {description}"},
                ],
                max_tokens=60,
                temperature=0,
            )

            import json
            raw = response.choices[0].message.content.strip()
            data = json.loads(raw)
            return {
                "is_food": bool(data.get("is_food", False)),
                "is_halal": bool(data.get("is_halal", False)),
                "is_vegan": bool(data.get("is_vegan", False)),
                "is_vegetarian": bool(data.get("is_vegetarian", False)),
            }

        except Exception as e:
            print(f"Analyzer Error calling OpenAI: {e}")
            return {"is_food": False, "is_halal": False, "is_vegan": False, "is_vegetarian": False}
