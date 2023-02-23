from django.urls import path
from .views import SaveLoginData, index

urlpatterns = [
    path('save_login_data', SaveLoginData.as_view(), name='save_login_data'),
    path('', index, name='index')
]