from django.urls import path
from .views import HandleKeyPoints

urlpatterns = [
    path('handle_key_points/', HandleKeyPoints.as_view(), name='handle_key_points'),
]