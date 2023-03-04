from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import AppUserManager

# Create your models here.


class AppUser(AbstractUser):

    # Sets username to anything the user sets to be, blank=True makes username optional in forms
    username = models.CharField(max_length=50, blank=True)
    # Removes need to put password as auth is done using Social Login
    email = models.EmailField(_('email address'), max_length=100, unique=True)

    # Makes email the unique identifier of a entry, it is now the "username" which means unique identifier
    USERNAME_FIELD = 'email'
    # Makes email required
    REQUIRED_FIELDS = []

    objects = AppUserManager()

    def __str__(self):
        return self.email


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    image = models.ImageField()

    def __str__(self):
        return self.name
