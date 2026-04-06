from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Reminder
from .serializers import ReminderSerializer
from gtts import gTTS
import os

# List + Create
class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        reminder = serializer.save(user=self.request.user)

        print("Reminder title:", reminder.title)

        # Generate audio file using gTTS
        tts = gTTS(reminder.title, lang='en')
        
        file_name = f"{reminder.id}.mp3"
        file_path = os.path.join('reminder_audios', file_name)

        print("Saving audio to:", file_path)

        tts.save(file_path)

        print("Audio file saved successfully.")


# Retrieve + Update + Delete
class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):

        audio_path = os.path.join('reminder_audios', f"{instance.id}.mp3")

        if os.path.exists(audio_path):
            os.remove(audio_path)
            print("Audio file deleted successfully.")

        instance.delete()
    
    def perform_update(self, serializer):

        reminder = serializer.save()

        audio_path = os.path.join('reminder_audios', f"{reminder.id}.mp3")

        #delete old audio file if it exists
        if os.path.exists(audio_path):
            os.remove(audio_path)
            print("Old audio file deleted successfully.")


        # Generate new audio file using gTTS
        tts = gTTS(reminder.title, lang='en')
        tts.save(audio_path)

        print("New audio file saved successfully.")