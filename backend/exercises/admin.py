from django.contrib import admin
from .models import Exercise, ExerciseRegime, ExerciseStatistics
# Register your models here.
admin.site.register(Exercise)
admin.site.register(ExerciseRegime)
admin.site.register(ExerciseStatistics)