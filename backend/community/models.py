from django.db import models
from django.forms import CharField
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Community(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=10000)
    banner = models.ImageField(blank=True, null=True)
    created_at = models.TimeField(auto_now_add=True)
    created_by = models.ForeignKey(User,on_delete=models.SET_DEFAULT,default='Deleted User')
    privacy_level = models.SmallIntegerField(default=0)

    def __str__(self):
        return self.name

    