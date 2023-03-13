from django.urls import path
from .views import ExerciseDetailView, ExerciseUpdateView, ExerciseStatisticsView, ExerciseRegimeView, ExerciseListView
urlpatterns = [
    path('exercise/update', ExerciseUpdateView.as_view(), name='update_exercise'),
    path('exercise/<int:pk>', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercise/list', ExerciseListView.as_view(), name='exercise_list'),
    path('exercise_statistics', ExerciseStatisticsView.as_view(), name='exercise_statistics'),
    path('exercise_regime/', ExerciseRegimeView.as_view(), name='exercise_regime'),
    path('exercise_regime/<int:pk>', ExerciseRegimeView.as_view(), name='exercise_regime')
]