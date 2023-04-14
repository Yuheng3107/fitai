from django.contrib import admin
from .models import Exercise, ExerciseRegime, ExerciseStatistics, ExerciseRegimeStatistics
# Register your models here.
admin.site.register(Exercise)
admin.site.register(ExerciseRegime)
admin.site.register(ExerciseStatistics)
admin.site.register(ExerciseRegimeStatistics)