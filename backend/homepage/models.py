from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import AppUserManager

# Create your models here.


class Achievement(models.Model):

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    image = models.ImageField()

    def __str__(self):
        return self.name


class AppUser(AbstractUser):

    # Sets username to anything the user sets to be, blank=True makes username optional in forms
    username = models.CharField(max_length=50, blank=True)
    # Removes need to put password as auth is done using Social Login
    email = models.EmailField(_('email address'), max_length=100, unique=True)
    profile_photo = models.ImageField(blank=True, null=True)
    # Many to Many relationship with Achievement
    achievements = models.ManyToManyField(
        Achievement, related_name='users', blank=True)
    # Makes email the unique identifier of a entry, it is now the "username" which means unique identifier
    USERNAME_FIELD = 'email'
    # Makes username required when making superuser
    REQUIRED_FIELDS = ['username']

    objects = AppUserManager()

    def __str__(self):
        # Returns username if got username
        return self.username or self.email
