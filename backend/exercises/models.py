from django.db import models
from feed.models import Post # type: ignore
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Exercise(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(blank=True, null=True)
    # To gauge popularity
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
    exercises = models.ManyToManyField('Exercise',through='ExerciseDetails')
    times_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ExerciseDetails(models.Model):
    """
    through table for exercise and exercise regime, including exercise details.
    """
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    exercise_regime = models.ForeignKey('ExerciseRegime', on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField(default=0)
    rep_count = models.PositiveSmallIntegerField(default=10)
    set_count = models.PositiveSmallIntegerField(default=3)

class ExerciseRegimeStatistics(models.Model):
    """
    through table for users and exercises, including exercise stats.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_regime = models.ForeignKey('ExerciseRegime', on_delete=models.CASCADE)
    times_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user} stats for {self.exercise_regime}"



