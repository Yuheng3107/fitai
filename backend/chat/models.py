from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class ChatGroup(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User)
    created_by = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None, null=True, related_name='creator')
    def __str__(self):
        return self.name

class ChatMessage(models.Model):
    sent_at = models.DateTimeField(auto_now_add=True)
    # Delete all messages user sent if user is deleted
    sender = models.ForeignKey(
        User, on_delete=models.SET_DEFAULT, default=None, null=True, blank=True)
    text = models.CharField(max_length=1000)
    # Delete all messages if the group is deleted
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name="chat_messages")

    def __str__(self):
        return self.text
