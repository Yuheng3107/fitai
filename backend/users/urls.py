from django.urls import path
from .views import *
urlpatterns = [
    # Login stuff
    path('user/create', UserCreateView.as_view(), name='create_user'),
    path('user', UserDetailView.as_view(), name='user_detail'),
    path('user/<int:pk>', UserOthersDetailView.as_view(), name='other_user_detail'),
    path('user/list', UserOthersListView.as_view(), name="other_user_list"),
    path('user/allowed', UserAllowedView.as_view(), name='user_allowed'),
    # Update normal user fields
    path('user/update', UserUpdateView.as_view(), name='update_user'),
    # Update user profile photo
    path('user/update/profile_photo', UserUpdateProfilePhotoView.as_view(), name='update_user_profile_photo'),
    # Check login status
    path('user/status', CheckLoginStatus.as_view(), name='login_status'),
    # Update m2m relationships
    path('user/update/achievements', UserAchievementsUpdateView.as_view(), name='update_user_achievements'),
    path('user/update/friend_request', UserFriendRequestUpdatetView.as_view(), name='update_user_friend_requests'),
    path('user/accept/friend_request', UserFriendRequestAcceptView.as_view(), name='accept_user_friend_requests'),
    path('user/decline/friend_request', UserFriendRequestDeclineView.as_view(), name='decline_user_friend_requests'),
    path('user/update/blocked', UserBlockedUpdateView.as_view(), name='update_user_blocked'),
    path('user/update/communities', UserCommunitiesUpdateView.as_view(), name='update_user_communities'),
    path('user/update/exercises', UserExercisesUpdateView.as_view(), name='update_user_exercises'),
    path('user/update/exercise_regimes', UserExerciseRegimesUpdateView.as_view(), name='update_user_exercise_regimes'),
    path('user/update/chat_groups', UserChatGroupsUpdateView.as_view(), name='update_user_chat_groups'),
    path('user/update/following', UserFollowingUpdateView.as_view(), name='update_user_following'),
    # Delete m2m 
    path('user/delete/achievements/<int:pk>', UserAchievementsDeleteView.as_view(), name='delete_user_achievements'),
    path('user/delete/friend_request/<int:pk>', UserFriendRequestDeleteView.as_view(), name='delete_user_friend_requests'),
    path('user/delete/blocked/<int:pk>', UserBlockedDeleteView.as_view(), name='delete_user_blocked'),
    path('user/delete/communities/<int:pk>', UserCommunitiesDeleteView.as_view(), name='delete_user_communities'),
    path('user/delete/exercises/<int:pk>', UserExercisesDeleteView.as_view(), name='delete_user_exercises'),
    path('user/delete/exercise_regimes/<int:pk>', UserExerciseRegimesDeleteView.as_view(), name='delete_user_exercise_regimes'),
    path('user/delete/chat_groups/<int:pk>', UserChatGroupsDeleteView.as_view(), name='delete_user_chat_groups'),
    path('user/delete/following/<int:pk>', UserFollowingDeleteView.as_view(), name='delete_user_following'),
    path('user/delete/friend/<int:pk>', UserFriendDeleteView.as_view(), name='delete_user_friend'),
    # List Views
    path('user/list/following', UserFollowingListView.as_view(), name='user_following_list'),
    path('user/list/followers', UserFollowerListView.as_view(), name='user_followers_list'),
    # Streak Views
    path('user/streak/update', UserStreakUpdateView.as_view(), name='update_user_streak'),
    # Search
    path('user/search', UserSearchView.as_view(), name='search_users'),
]