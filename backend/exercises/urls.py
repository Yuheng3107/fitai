from django.urls import path
from .views import ExerciseView
urlpatterns = [
    path('exercise_data', ExerciseView.as_view(), name='exercise_data'),
]