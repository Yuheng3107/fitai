from django.urls import path
from .views import UserPostCreateView, UserPostLikesUpdateView, UserPostTagsUpdateView, UserPostUpdateView, UserPostDetailView, UserPostListView, UserPostDeleteView, CommentCreateView, CommentUpdateView, CommentDetailView, CommentListView, CommentDeleteView, CommentLikesUpdateView, CommunityPostCreateView, CommunityPostUpdateView, CommunityPostDetailView, CommunityPostListView, CommunityPostDeleteView, CommunityPostLikesUpdateView, CommunityPostTagsUpdateView
urlpatterns = [
    #UserPost
    path('user_post/<int:pk>', UserPostDetailView.as_view(), name='user_post_detail'),
    path('user_post/list', UserPostListView.as_view(), name='user_post_list'),
    path('user_post/create', UserPostCreateView.as_view(), name='create_user_post'),
    path('user_post/update', UserPostUpdateView.as_view(), name='update_user_post'),
    path('user_post/delete/<int:pk>', UserPostDeleteView.as_view(), name='delete_user_post'),
    path('user_post/update/tags', UserPostTagsUpdateView.as_view(), name='update_user_post_tags'),
    path('user_post/update/likes', UserPostLikesUpdateView.as_view(), name='update_user_post_likes'),
    
    #Comments
    path('comment/<int:pk>', CommentDetailView.as_view(), name='comment_detail'),
    path('comment/list', CommentListView.as_view(), name='comment_list'),
    path('comment/create', CommentCreateView.as_view(), name='create_comment'),
    path('comment/update', CommentUpdateView.as_view(), name='update_comment'),
    path('comment/delete/<int:pk>', CommentDeleteView.as_view(), name='delete_comment'),
    path('comment/update/likes', CommentLikesUpdateView.as_view(), name='update_comment_likes'),

    #Community Posts
    path('community_post/<int:pk>', CommunityPostDetailView.as_view(), name='community_post_detail'),
    path('community_post/list', CommunityPostListView.as_view(), name='community_post_list'),
    path('community_post/create', CommunityPostCreateView.as_view(), name='create_community_post'),
    path('community_post/update', CommunityPostUpdateView.as_view(), name='update_community_post'),
    path('community_post/delete/<int:pk>', CommunityPostDeleteView.as_view(), name='delete_community_post'),
    path('community_post/update/tags', CommunityPostTagsUpdateView.as_view(), name='update_community_post_tags'),
    path('community_post/update/likes', CommunityPostLikesUpdateView.as_view(), name='update_community_post_likes'),
]