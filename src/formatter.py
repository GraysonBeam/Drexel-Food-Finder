import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class Formatter:
    def __init__(self):
        api_key = os.getenv("GPT_API_KEY")
        self.client = OpenAI(api_key=api_key)

    def format_message(self, description, time, location):
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Use the 'mini' model - it's cheaper and faster
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant. Take the following information and format EXACTLY event title: date:, time:, location:, food offered:. with each point being its own line. keep title and overall message as concise as possible, no bloating. you do not need to use the max tokens provided",
                    },
                    {
                        "role": "user",
                        "content": f"Event Description: {description}, Event Time: {time}, Location: {location}",
                    },
                ],
                max_tokens=50,  # We only need a few words, so keep this tiny to limit response
                temperature=0,  # 0 makes the ChatGPT 'strict' and consistent
            )

            # Clean up the answer
            answer = response.choices[0].message.content.strip().upper()

            # Convert the string 'TRUE' into a real Python Boolean (True)
            return answer

        except Exception as e:
            return f"Error calling OpenAI: {e}"
