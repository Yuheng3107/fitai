from django.urls import path
from .views import ExerciseView, ExerciseStatisticsView, ExerciseRegimeView
urlpatterns = [
    path('exercise_data', ExerciseView.as_view(), name='exercise_data'),
    path('exercise_statistics', ExerciseStatisticsView.as_view(), name='exercise_statistics'),
    path('exercise_regime', ExerciseRegimeView.as_view(), name='exercise_regime')
]