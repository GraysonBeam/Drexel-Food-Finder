import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()


class Notifier:
    def __init__(self):
        self.token = os.getenv("PUSHBULLET-KEY")

    def send_noti(self, title, body):
        msg = {"type": "note", "title": title, "body": body}

        resp = requests.post(
            "https://api.pushbullet.com/v2/pushes",
            data=json.dumps(msg),
            headers={
                "Authorization": "Bearer " + self.token,
                "Content-Type": "application/json",
            },
        )
        if resp.status_code != 200:
            raise Exception("Error", resp.status_code)
        else:
            print("Message sent")
