from django.urls import path
from .views import LoginDataView, CheckLoginStatus, AchievementView

urlpatterns = [
    path('login_data', LoginDataView.as_view(), name='login_data'),
    path('check_login_status', CheckLoginStatus.as_view(), name='check_login_status'),
    path('achievement_data', AchievementView.as_view(), name='achievement_view')
    
]