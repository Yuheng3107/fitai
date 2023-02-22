from django.urls import path
from .views import SaveLoginData

urlpatterns = [
    path('save_login_data', SaveLoginData.as_view(), name='save_login_data'),
]