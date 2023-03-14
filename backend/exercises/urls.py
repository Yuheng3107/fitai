from django.urls import path
from .views import ExerciseDetailView, ExerciseUpdateView, ExerciseListView, ExerciseStatisticsDetailView, ExerciseStatisticsUpdateView, ExerciseStatisticsCreateView, ExerciseRegimeDetailView, ExerciseRegimeDeleteView, ExerciseRegimeCreateView, ExerciseRegimeUpdateView
urlpatterns = [
    # Exercises
    path('exercise/update', ExerciseUpdateView.as_view(), name='update_exercise'),
    path('exercise/<int:pk>', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercise/list', ExerciseListView.as_view(), name='exercise_list'),
    # Exercise Statistics
    path('exercise_statistics/update', ExerciseStatisticsUpdateView.as_view(), name='update_exercise_statistics'),
    path('exercise_statistics/create', ExerciseStatisticsCreateView.as_view(), name='create_exercise_statistics'),
    path('exercise_statistics/<int:pk>', ExerciseStatisticsDetailView.as_view(), name='exercise_statistics_detail'),
    # Exercise Regimes
    path('exercise_regime/<int:pk>', ExerciseRegimeDetailView.as_view(), name='exercise_regime_detail'),
    path('exercise_regime/delete/<int:pk>', ExerciseRegimeDeleteView.as_view(), name='delete_exercise_regime'),
    path('exercise_regime/create', ExerciseRegimeCreateView.as_view(), name='create_exercise_regime'),
    path('exercise_regime/update', ExerciseRegimeUpdateView.as_view(), name='update_exercise_regime'),
]