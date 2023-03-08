from django.db import models

# Create your models here.

class Achievement(models.Model):

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    image = models.ImageField()

    def __str__(self):
        return self.name
