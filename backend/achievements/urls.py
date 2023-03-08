from django.urls import path
from .views import AchievementView

urlpatterns = [
    path('data', AchievementView.as_view(), name='achievement_view')
]