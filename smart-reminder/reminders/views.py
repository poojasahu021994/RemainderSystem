from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
import requests

from .models import Reminder
from .serializers import ReminderSerializer


#  ThingSpeak function
def send_to_thingspeak(reminder):
    url = "https://api.thingspeak.com/update"

    params = {
        "api_key": "Y9K50LWYT0XB7WI9",

        "field1": reminder.title[:50],
        "field2": int(reminder.reminder_time.timestamp()),
        "field3": 1 if reminder.repeat_daily else 0
    }

    try:
        response = requests.get(url, params=params)
        print("ThingSpeak response:", response.text)
    except Exception as e:
        print("ThingSpeak error:", e)


class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        reminder = serializer.save(user=self.request.user)
        print("Reminder created:", reminder.title)


class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()
        print("Reminder deleted")

    def perform_update(self, serializer):
        reminder = serializer.save()
        print("Reminder updated:", reminder.title)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    now = timezone.now()

    reminders = Reminder.objects.filter(
        user=request.user,
        reminder_time__lte=now,
        is_triggered=False  
    )

    serializer = ReminderSerializer(reminders, many=True)

    for reminder in reminders:

        # ThingSpeak call
        send_to_thingspeak(reminder)

        reminder.is_triggered = True

        if reminder.repeat_daily:
            reminder.reminder_time += timedelta(days=1)
            reminder.is_triggered = False

        reminder.save()

    print("Notifications sent:", len(reminders))

    return Response(serializer.data)