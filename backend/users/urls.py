from django.urls import path
from .views import  CheckLoginStatus, UserCreateView, UserDetailView

urlpatterns = [
    # Login stuff
    path('user/create', UserCreateView.as_view(), name='create_user'),
    path('user', UserDetailView.as_view(), name='user_detail'),
    # Check login status
    path('user/status', CheckLoginStatus.as_view(), name='login_status')
]