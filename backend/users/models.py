from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import AppUserManager

# Create your models here.
class AppUser(AbstractUser):

    # Sets username to anything the user sets to be, blank=True makes username optional in forms
    username = models.CharField(max_length=50, null=True, blank=True, unique=True)
    # Removes need to put password as auth is done using Social Login
    email = models.EmailField(_('email address'), max_length=100, unique=True)
    profile_photo = models.ImageField(blank=True, null=True)
    date_created = models.DateField(auto_now_add=True, null=True)
    privacy_level = models.SmallIntegerField(default=0)
    # Makes email the unique identifier of a entry, it is now the "username" which means unique identifier
    USERNAME_FIELD = 'email'
    # Makes username required when making superuser
    REQUIRED_FIELDS = ['username']

    ########
    # Relations

    # Many to Many Achievements
    achievements = models.ManyToManyField(
        'achievements.Achievement', related_name='users', blank=True)
    # Many to Many friends
    friends = models.ManyToManyField('self')
    # Many to Many people they follow
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers')
    # Many to Many friends
    blocked = models.ManyToManyField('self', symmetrical=False)
    # Many to Many communities
    communities = models.ManyToManyField('community.Community', through='community.CommunityMembers')
    # Many to Many exercises, with stats included
    exercises = models.ManyToManyField('exercises.Exercise', through='exercises.ExerciseStatistics')
    # Many to Many exercise regimes, with stats included
    exercise_regimes = models.ManyToManyField('exercises.ExerciseRegime', through='exercises.ExerciseRegimeStatistics')
    # Many to Many chats
    chat_groups = models.ManyToManyField('chat.ChatGroup')
    

    objects = AppUserManager()

    def __str__(self):
        # Returns username if got username
        return self.username or self.email