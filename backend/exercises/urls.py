from django.urls import path
from .views import ExerciseDetailView, ExerciseUpdateView, ExerciseListView, ExerciseStatisticsDetailView, ExerciseStatisticsUpdateView, ExerciseStatisticsCreateView, ExerciseRegimeDetailView, ExerciseRegimeDeleteView, ExerciseRegimeCreateView, ExerciseRegimeUpdateView
from .views import ExerciseLikesUpdateView, ExerciseLikesDeleteView, ExerciseTagsUpdateView, ExerciseTagsDeleteView, ExerciseShareUpdateView, ExerciseShareDeleteView
from .views import ExerciseRegimeLikesUpdateView, ExerciseRegimeLikesDeleteView, ExerciseRegimeTagsUpdateView, ExerciseRegimeTagsDeleteView, ExerciseRegimeShareUpdateView, ExerciseRegimeShareDeleteView
urlpatterns = [
    # Exercises
    path('exercise/update', ExerciseUpdateView.as_view(), name='update_exercise'),
    path('exercise/<int:pk>', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercise/list', ExerciseListView.as_view(), name='exercise_list'),
    path('exercise/update/tags', ExerciseTagsUpdateView.as_view(), name='update_exercise_tags'),
    path('exercise/update/likes', ExerciseLikesUpdateView.as_view(), name='update_exercise_likes'),
    path('exercise/delete/tags/<int:pk_post>/<slug:tag_name>', ExerciseTagsDeleteView.as_view(), name='delete_exercise_tags'),
    path('exercise/delete/likes/<int:pk>', ExerciseLikesDeleteView.as_view(), name='delete_exercise_likes'),
    path('exercise/update/share', ExerciseShareUpdateView.as_view(), name='update_exercise_share'),
    path('exercise/delete/share/<int:pk>', ExerciseShareDeleteView.as_view(), name='delete_exercise_share'),
    # Exercise Statistics
    path('exercise_statistics/update', ExerciseStatisticsUpdateView.as_view(), name='update_exercise_statistics'),
    path('exercise_statistics/create', ExerciseStatisticsCreateView.as_view(), name='create_exercise_statistics'),
    path('exercise_statistics/<int:pk>', ExerciseStatisticsDetailView.as_view(), name='exercise_statistics_detail'),
    # Exercise Regimes
    path('exercise_regime/<int:pk>', ExerciseRegimeDetailView.as_view(), name='exercise_regime_detail'),
    path('exercise_regime/delete/<int:pk>', ExerciseRegimeDeleteView.as_view(), name='delete_exercise_regime'),
    path('exercise_regime/create', ExerciseRegimeCreateView.as_view(), name='create_exercise_regime'),
    path('exercise_regime/update', ExerciseRegimeUpdateView.as_view(), name='update_exercise_regime'),
    path('exercise_regime/update/tags', ExerciseRegimeTagsUpdateView.as_view(), name='update_exercise_regime_tags'),
    path('exercise_regime/update/likes', ExerciseRegimeLikesUpdateView.as_view(), name='update_exercise_regime_likes'),
    path('exercise_regime/delete/tags/<int:pk_post>/<slug:tag_name>', ExerciseRegimeTagsDeleteView.as_view(), name='delete_exercise_regime_tags'),
    path('exercise_regime/delete/likes/<int:pk>', ExerciseRegimeLikesDeleteView.as_view(), name='delete_exercise_regime_likes'),
    path('exercise_regime/update/share', ExerciseRegimeShareUpdateView.as_view(), name='update_exercise_regime_share'),
    path('exercise_regime/delete/share/<int:pk>', ExerciseRegimeShareDeleteView.as_view(), name='delete_exercise_regime_share'),
]