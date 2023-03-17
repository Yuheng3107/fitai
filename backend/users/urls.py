from django.urls import path
from .views import  CheckLoginStatus, UserCreateView, UserDetailView, UserAchievementUpdateView, UserFriendsUpdateView, UserCommunitiesUpdateView, UserExercisesUpdateView, UserExerciseRegimesUpdateView, UserChatGroupsUpdateView

urlpatterns = [
    # Login stuff
    path('user/create', UserCreateView.as_view(), name='create_user'),
    path('user', UserDetailView.as_view(), name='user_detail'),
    # Check login status
    path('user/status', CheckLoginStatus.as_view(), name='login_status'),
    # Update m2m relationships
    path('user/update/achievements', UserAchievementUpdateView.as_view(), name='update_user_achievements'),
    path('user/update/friends', UserFriendsUpdateView.as_view(), name='update_user_friends'),
    path('user/update/communities', UserCommunitiesUpdateView.as_view(), name='update_user_communities'),
    path('user/update/exercises', UserExercisesUpdateView.as_view(), name='update_user_exercises'),
    path('user/update/exercise_regimes', UserExerciseRegimesUpdateView.as_view(), name='update_user_exercise_regimes'),
    path('user/update/chat_groups', UserChatGroupsUpdateView.as_view(), name='update_user_chat_groups'),
]