from django.db import models
from feed.models import FeedPost #type: ignore
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
User = get_user_model()

# Create your models here.

class Exercise(FeedPost):
    title = None
    name = models.CharField(max_length=50)
    # To gauge popularity
    perfect_reps = models.PositiveIntegerField(default=0)
    total_reps = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ExerciseStatistics(models.Model):
    """
    through table for users and exercises, including exercise stats.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    perfect_reps = models.PositiveIntegerField(default=0)
    total_reps = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user} stats for {self.exercise}"

class ExerciseRegime(FeedPost):
    name = models.CharField(max_length=50)
    exercises = ArrayField(models.PositiveSmallIntegerField())
    times_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ExerciseDetails(models.Model):
    """
    through table for exercise and exercise regime, including exercise details.
    """
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    exercise_regime = models.ForeignKey('ExerciseRegime', on_delete=models.CASCADE)
    # Order gives index of the exercise array we are at
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


class ExerciseSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    exercise_regime = models.ForeignKey(ExerciseRegime, on_delete=models.SET_NULL, blank=True, null=True)
    sets = models.PositiveSmallIntegerField(default=1)
    duration = models.PositiveSmallIntegerField()
    reps = models.PositiveSmallIntegerField(default=0)
    perfect_reps = models.PositiveSmallIntegerField(default=0)
    start_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.exercise.name} Session of {self.user.username}"