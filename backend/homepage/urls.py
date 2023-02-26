from django.urls import path
from .views import SaveLoginData, CheckLoginStatus, GetLoginData

urlpatterns = [
    path('save_login_data', SaveLoginData.as_view(), name='save_login_data'),
    path('check_login_status', CheckLoginStatus.as_view(), name='check_login_status'),
    path('get_login_data', GetLoginData.as_view(), name='get_login_data'),
]