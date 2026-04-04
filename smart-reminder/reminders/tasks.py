from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Reminder
import json
import paho.mqtt.publish as publish
import os

@shared_task
def check_reminders():

    now = timezone.now()
    print("NOW:", now)

    reminders = Reminder.objects.filter(
        reminder_time__lte=now
        
    )

    for reminder in reminders:

        print("Processing:", reminder.title)

        message = json.dumps({
            "title": reminder.title,
            "audio_id": reminder.id,
            "audio_url": f"http://172.25.72.145:8000/reminder_audios/{reminder.id}.mp3",
            "repeat_daily": reminder.repeat_daily     
})

        audio_path = f"reminder_audios/{reminder.id}.mp3"

        # 🔁 Repeat daily reminder
        if reminder.repeat_daily:

            publish.single(
                topic="reminder/device1",
                payload=message,
                hostname="broker.hivemq.com"
            )

            reminder.reminder_time = reminder.reminder_time + timedelta(days=1)
            reminder.is_triggered = False
            reminder.save()
            print("status", reminder.is_triggered)

        # 🔹 One-time reminder
        elif not reminder.is_triggered:

            publish.single(
                topic="reminder/device1",
                payload=message,
                hostname="broker.hivemq.com"
            )

            reminder.is_triggered = True
            reminder.save()

            # 🔥 delete audio after use
            if os.path.exists(audio_path):
                os.remove(audio_path)
                print("Deleted audio:", audio_path)