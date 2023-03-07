from django.urls import path
from .views import LoginDataView, CheckLoginStatus

urlpatterns = [
    path('save_login_data', LoginDataView.as_view(), name='save_login_data'),
    path('check_login_status', CheckLoginStatus.as_view(), name='check_login_status'),
    
]