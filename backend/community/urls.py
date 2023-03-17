from django.urls import path
from .views import *
urlpatterns = [
    path('community/<int:pk>', CommunityDetailView.as_view(), name='community_detail'),
    path('community/list', CommunityListView.as_view(), name='community_list'),
    path('community/create', CommunityCreateView.as_view(), name='create_community'),
    path('community/update', CommunityUpdateView.as_view(), name='update_community'),
    path('community/delete/<int:pk>', CommunityDeleteView.as_view(), name='delete_community'),
    path('community_members/update', CommunityMemberUpdateView.as_view(), name='update_community_members'),
]