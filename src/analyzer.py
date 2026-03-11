import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class Analyzer:
    def __init__(self):
        api_key = os.getenv("GPT_API_KEY")
        self.client = OpenAI(api_key=api_key)

    def is_free_food(self, description):
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Use the 'mini' model - it's cheaper and faster
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant. Determine if the following event description mentions free food. TRUE/FALSE, 'TRUE' if food is provided by the event and if the food is substantial(not just free drinks or small snacks), or 'FALSE' if there isn't.",
                    },
                    {"role": "user", "content": f"Event Description: {description}"},
                ],
                max_tokens=5,  # We only need one word, so keep this tiny to limit response
                temperature=0,  # 0 makes the ChatGPT 'strict' and consistent
            )

            # Clean up the answer
            answer = response.choices[0].message.content.strip().upper()

            # Convert the string 'TRUE' into a real Python Boolean (True)
            return answer

        except Exception as e:
            print(f"Analyzer Error calling OpenAI: {e}")
            return False, "Error Calling OpenAI"
