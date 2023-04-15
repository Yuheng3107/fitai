from django.urls import path
from .views import *
urlpatterns = [
    #UserPost
    path('user_post/<int:pk>', UserPostDetailView.as_view(), name='user_post_detail'),
    path('user_post/list', UserPostListView.as_view(), name='user_post_list'),
    path('user_post/create', UserPostCreateView.as_view(), name='create_user_post'),
    path('user_post/update', UserPostUpdateView.as_view(), name='update_user_post'),
    path('user_post/delete/<int:pk>', UserPostDeleteView.as_view(), name='delete_user_post'),
    path('user_post/update/tags', UserPostTagsUpdateView.as_view(), name='update_user_post_tags'),
    path('user_post/update/likes', UserPostLikesUpdateView.as_view(), name='update_user_post_likes'),
    path('user_post/delete/tags/<int:pk_post>/<slug:tag_name>', UserPostTagsDeleteView.as_view(), name='delete_user_post_tags'),
    path('user_post/delete/likes/<int:pk>', UserPostLikesDeleteView.as_view(), name='delete_user_post_likes'),
    path('user_post/update/share', UserPostShareUpdateView.as_view(), name='update_user_post_share'),
    path('user_post/delete/share/<int:pk>', UserPostShareDeleteView.as_view(), name='delete_user_post_share'),
    path('user_post/update/media', UserPostMediaUpdateView.as_view(), name='update_user_post_media'),
    path('user_post/delete/media/<int:pk>', UserPostMediaDeleteView.as_view(), name='delete_user_post_media'),
    path('user_post/latest', LatestUserPostView.as_view(), name='latest_user_post'),
    #Comments
    path('comment/<int:pk>', CommentDetailView.as_view(), name='comment_detail'),
    path('comment/list', CommentListView.as_view(), name='comment_list'),
    path('comment/create', CommentCreateView.as_view(), name='create_comment'),
    path('comment/update', CommentUpdateView.as_view(), name='update_comment'),
    path('comment/delete/<int:pk>', CommentDeleteView.as_view(), name='delete_comment'),
    path('comment/update/likes', CommentLikesUpdateView.as_view(), name='update_comment_likes'),
    path('comment/delete/likes/<int:pk>', CommentLikesDeleteView.as_view(), name='delete_comment_likes'),
    

    #Community Posts
    path('community_post/<int:pk>', CommunityPostDetailView.as_view(), name='community_post_detail'),
    path('community_post/list', CommunityPostListView.as_view(), name='community_post_list'),
    path('community_post/create', CommunityPostCreateView.as_view(), name='create_community_post'),
    path('community_post/update', CommunityPostUpdateView.as_view(), name='update_community_post'),
    path('community_post/delete/<int:pk>', CommunityPostDeleteView.as_view(), name='delete_community_post'),
    path('community_post/update/tags', CommunityPostTagsUpdateView.as_view(), name='update_community_post_tags'),
    path('community_post/update/likes', CommunityPostLikesUpdateView.as_view(), name='update_community_post_likes'),
    path('community_post/delete/tags/<int:pk_post>/<slug:tag_name>', CommunityPostTagsDeleteView.as_view(), name='delete_community_post_tags'),
    path('community_post/delete/likes/<int:pk>', CommunityPostLikesDeleteView.as_view(), name='delete_community_post_likes'),
    path('community_post/update/share', CommunityPostShareUpdateView.as_view(), name='update_community_post_share'),
    path('community_post/delete/share/<int:pk>', CommunityPostShareDeleteView.as_view(), name='delete_community_post_share'),
    path('community_post/update/media', CommunityPostMediaUpdateView.as_view(), name='update_community_post_media'),
    path('community_post/delete/media/<int:pk>', CommunityPostMediaDeleteView.as_view(), name='delete_community_post_media'),
]