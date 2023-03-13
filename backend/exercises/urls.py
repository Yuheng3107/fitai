from django.urls import path
from .views import ExerciseDetailView, ExerciseUpdateView, ExerciseStatisticsView, ExerciseRegimeView
urlpatterns = [
    path('exercise_data/update', ExerciseUpdateView.as_view(), name='update_exercise'),
    path('exercise_data/<int:pk>', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercise_statistics', ExerciseStatisticsView.as_view(), name='exercise_statistics'),
    path('exercise_regime/', ExerciseRegimeView.as_view(), name='exercise_regime'),
    path('exercise_regime/<int:pk>', ExerciseRegimeView.as_view(), name='exercise_regime')
]