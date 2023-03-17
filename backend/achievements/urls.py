from django.urls import path
from .views import AchievementListView

urlpatterns = [
    path('achievement/list', AchievementListView.as_view(), name='achievement_list')
]