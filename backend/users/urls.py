from django.urls import path
from .views import  CheckLoginStatus, UserCreateView, UserDetailView, UserAchievementsUpdateView, UserFriendsUpdateView, UserCommunitiesUpdateView, UserExercisesUpdateView, UserExerciseRegimesUpdateView, UserChatGroupsUpdateView
from .views import UserAchievementsDeleteView, UserFriendsDeleteView, UserCommunitiesDeleteView, UserExercisesDeleteView, UserExerciseRegimesDeleteView, UserChatGroupsDeleteView, UserAllowedView
urlpatterns = [
    # Login stuff
    path('user/create', UserCreateView.as_view(), name='create_user'),
    path('user', UserDetailView.as_view(), name='user_detail'),
    path('user/allowed', UserAllowedView.as_view(), name='user_allowed'),
    # Check login status
    path('user/status', CheckLoginStatus.as_view(), name='login_status'),
    # Update m2m relationships
    path('user/update/achievements', UserAchievementsUpdateView.as_view(), name='update_user_achievements'),
    path('user/update/friends', UserFriendsUpdateView.as_view(), name='update_user_friends'),
    path('user/update/communities', UserCommunitiesUpdateView.as_view(), name='update_user_communities'),
    path('user/update/exercises', UserExercisesUpdateView.as_view(), name='update_user_exercises'),
    path('user/update/exercise_regimes', UserExerciseRegimesUpdateView.as_view(), name='update_user_exercise_regimes'),
    path('user/update/chat_groups', UserChatGroupsUpdateView.as_view(), name='update_user_chat_groups'),
    # Delete m2m 
    path('user/delete/achievements/<int:pk>', UserAchievementsDeleteView.as_view(), name='delete_user_achievements'),
    path('user/delete/friends/<int:pk>', UserFriendsDeleteView.as_view(), name='delete_user_friends'),
    path('user/delete/communities/<int:pk>', UserCommunitiesDeleteView.as_view(), name='delete_user_communities'),
    path('user/delete/exercises/<int:pk>', UserExercisesDeleteView.as_view(), name='delete_user_exercises'),
    path('user/delete/exercise_regimes/<int:pk>', UserExerciseRegimesDeleteView.as_view(), name='delete_user_exercise_regimes'),
    path('user/delete/chat_groups/<int:pk>', UserChatGroupsDeleteView.as_view(), name='delete_user_chat_groups'),
    
]