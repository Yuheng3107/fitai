from django.urls import path
from .views import UserPostView, CommentView, CommunityPostView
urlpatterns = [
    path('user_post', UserPostView.as_view(), name='user_post'),
    path('comment', CommentView.as_view(), name='comment'),
    path('community_post', CommunityPostView.as_view(), name='community_post'),
]