from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.


class ChatGroup(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(get_user_model())


class ChatMessage(models.Model):
    sent_at = models.DateTimeField(auto_now=True)
    # Delete all messages user sent if user is deleted
    sender = models.ForeignKey(
        get_user_model(), on_delete=models.SET_DEFAULT, default="Deleted User")
    content = models.CharField(max_length=1000)
    # Delete all messages if the group is deleted
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE)
