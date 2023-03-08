from django.urls import path
from .views import LoginDataView, CheckLoginStatus

urlpatterns = [
    path('data', LoginDataView.as_view(), name='login_data'),
    path('status', CheckLoginStatus.as_view(), name='login_status')
]