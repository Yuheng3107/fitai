from django.db import models
from feed.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Exercise(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(blank=True, null=True)
    perfect_reps = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ExerciseStatistics(models.Model):
    """
    through table for users and exercises, including exercise stats.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    perfect_reps = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user} stats for {self.exercise}"

class ExerciseRegime(Post):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=10000)
    exercises = models.ManyToManyField('Exercise')
    times_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ExerciseRegimeStatistics(models.Model):
    """
    through table for users and exercises, including exercise stats.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_regime = models.ForeignKey('ExerciseRegime', on_delete=models.CASCADE)
    times_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user} stats for {self.exercise_regime}"



