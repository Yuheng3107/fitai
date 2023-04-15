from django.urls import path
from .views import ExerciseDetailView, ExerciseUpdateView, ExerciseListView, ExerciseStatisticsDetailView, ExerciseStatisticsUpdateView, ExerciseStatisticsCreateView, ExerciseRegimeDetailView, ExerciseRegimeDeleteView, ExerciseRegimeCreateView, ExerciseRegimeUpdateView
from .views import ExerciseLikesUpdateView, ExerciseLikesDeleteView, ExerciseTagsUpdateView, ExerciseTagsDeleteView, ExerciseShareUpdateView, ExerciseShareDeleteView, ExerciseMediaUpdateView, ExerciseMediaDeleteView
from .views import ExerciseRegimeLikesUpdateView, ExerciseRegimeLikesDeleteView, ExerciseRegimeTagsUpdateView, ExerciseRegimeTagsDeleteView, ExerciseRegimeShareUpdateView, ExerciseRegimeShareDeleteView, ExerciseRegimeMediaUpdateView, ExerciseRegimeMediaDeleteView, FavoriteExerciseStatisticView, FavoriteExerciseRegimeStatisticView, ExerciseSessionCreateView, LatestExerciseSessionView
urlpatterns = [
    # Exercises
    path('exercise/favorite', FavoriteExerciseStatisticView.as_view(), name='favorite_exercise_statistic'),
    path('exercise/update', ExerciseUpdateView.as_view(), name='update_exercise'),
    path('exercise/<int:pk>', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercise/list', ExerciseListView.as_view(), name='exercise_list'),
    path('exercise/update/tags', ExerciseTagsUpdateView.as_view(), name='update_exercise_tags'),
    path('exercise/update/likes', ExerciseLikesUpdateView.as_view(), name='update_exercise_likes'),
    path('exercise/delete/tags/<int:pk_post>/<slug:tag_name>', ExerciseTagsDeleteView.as_view(), name='delete_exercise_tags'),
    path('exercise/delete/likes/<int:pk>', ExerciseLikesDeleteView.as_view(), name='delete_exercise_likes'),
    path('exercise/update/share', ExerciseShareUpdateView.as_view(), name='update_exercise_share'),
    path('exercise/delete/share/<int:pk>', ExerciseShareDeleteView.as_view(), name='delete_exercise_share'),
    path('exercise/update/media', ExerciseMediaUpdateView.as_view(), name='update_exercise_media'),
    path('exercise/delete/media/<int:pk>', ExerciseMediaDeleteView.as_view(), name='delete_exercise_media'),
    # Exercise Statistics
    path('exercise_statistics/update', ExerciseStatisticsUpdateView.as_view(), name='update_exercise_statistics'),
    path('exercise_statistics/create', ExerciseStatisticsCreateView.as_view(), name='create_exercise_statistics'),
    path('exercise_statistics/<int:pk>', ExerciseStatisticsDetailView.as_view(), name='exercise_statistics_detail'),
    # Exercise Regimes
    path('exercise_regime/favorite', FavoriteExerciseRegimeStatisticView.as_view(), name='favorite_exercise_regime_statistic'),
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
    path('exercise_regime/update/media', ExerciseRegimeMediaUpdateView.as_view(), name='update_exercise_regime_media'),
    path('exercise_regime/delete/media/<int:pk>', ExerciseRegimeMediaDeleteView.as_view(), name='delete_exercise_regime_media'),
    # Exercise Sessions
    path('exercise_session/create', ExerciseSessionCreateView.as_view(), name='create_exercise_session'),
    path('exercise_session/latest', LatestExerciseSessionView.as_view(), name='latest_exercise_session')
]