from rest_framework import serializers
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            'id',
            'title',
            'reminder_time',
            'repeat_daily',
            'audio_id',
            'is_triggered'
        ]
        read_only_fields = ['is_triggered']