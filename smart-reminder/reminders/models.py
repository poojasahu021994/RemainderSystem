from django.db import models
from django.contrib.auth.models import User

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    reminder_time = models.DateTimeField()
    is_triggered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    repeat_daily = models.BooleanField(default=False)
    audio_id = models.IntegerField(default=1)


    def __str__(self):
        return f"{self.title} - {self.user.username}"