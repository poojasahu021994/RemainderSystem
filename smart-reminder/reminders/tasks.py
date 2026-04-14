from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Reminder


@shared_task
def check_reminders():

    now = timezone.now()

    reminders = Reminder.objects.filter(
        reminder_time__lte=now,
        is_triggered=False
    )

    for reminder in reminders:

        reminder.is_triggered = True

        if reminder.repeat_daily:
            reminder.reminder_time += timedelta(days=1)
            reminder.is_triggered = False

        reminder.save()
