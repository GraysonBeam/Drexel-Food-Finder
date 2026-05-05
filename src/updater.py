import datetime

DATE = datetime.datetime.now()


class Updater:
    def __init__(self):
        with open("seen_events.txt", "r", encoding="utf-8") as file:
            self.seen_events = file.read().split("\n")

    def clear_already_happened(self):
        for i in range(1, len(self.seen_events), 2):
            line = self.seen_events[i].split(" ")
            month = int(line[0])
            day_of_month = int(line[1])

            if DATE.month > month or (DATE.month == month and DATE.day > day_of_month):
                # This event has already happened, so we delete its data
                self.seen_events.pop(i - 1)
                self.seen_events.pop(i - 1)

        with open("seen_events.txt", "w", encoding="utf-8") as file:
            file.write("\n".join(self.seen_events))
