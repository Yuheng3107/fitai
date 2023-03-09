from django.shortcuts import render
from rest_framework.views import APIView, Response
from .models import Exercise
# Create your views here.

class ExerciseView(APIView):
    def post(self, request):
        data = request.data 
        """JSON Post must contain exercise_id in id field"""
        id = data["id"]
        exercise = None
        if "perfect_reps" in data:
            exercise = Exercise.objects.get(pk=id)
            exercise.perfect_reps += data["perfect_reps"]
            exercise.save()
        
        return Response()