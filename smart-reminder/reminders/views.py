# from rest_framework import generics
# from rest_framework.permissions import IsAuthenticated
# from .models import Reminder
# from .serializers import ReminderSerializer
# from gtts import gTTS
# import os

# # List + Create
# class ReminderListCreateView(generics.ListCreateAPIView):
#     serializer_class = ReminderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Reminder.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         reminder = serializer.save(user=self.request.user)

#         print("Reminder title:", reminder.title)

#         # Generate audio file using gTTS
#         tts = gTTS(reminder.title, lang='en')
        
#         file_name = f"{reminder.id}.mp3"
#         file_path = os.path.join('reminder_audios', file_name)

#         print("Saving audio to:", file_path)

#         tts.save(file_path)

#         print("Audio file saved successfully.")


# # Retrieve + Update + Delete
# class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = ReminderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Reminder.objects.filter(user=self.request.user)

#     def perform_destroy(self, instance):

#         audio_path = os.path.join('reminder_audios', f"{instance.id}.mp3")

#         if os.path.exists(audio_path):
#             os.remove(audio_path)
#             print("Audio file deleted successfully.")

#         instance.delete()
    
#     def perform_update(self, serializer):

#         reminder = serializer.save()

#         audio_path = os.path.join('reminder_audios', f"{reminder.id}.mp3")

#         #delete old audio file if it exists
#         if os.path.exists(audio_path):
#             os.remove(audio_path)
#             print("Old audio file deleted successfully.")


#         # Generate new audio file using gTTS
#         tts = gTTS(reminder.title, lang='en')
#         tts.save(audio_path)

#         print("New audio file saved successfully.")

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone

from .models import Reminder
from .serializers import ReminderSerializer


# List + Create
class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        reminder = serializer.save(user=self.request.user)
        print("Reminder created:", reminder.title)


# Retrieve + Update + Delete
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


# 🔔 NEW: Notification API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    now = timezone.now()

    reminders = Reminder.objects.filter(
        user=request.user,
        reminder_time__lte=now
    )

    serializer = ReminderSerializer(reminders, many=True)

    for reminder in reminders:

        # mark as triggered
        reminder.is_triggered = True

        if reminder.repeat_daily:
            # next day ke liye set
            reminder.reminder_time += timedelta(days=1)

            # reset for next cycle
            reminder.is_triggered = False

        reminder.save()

    return Response(serializer.data)