from django.shortcuts import render
from rest_framework.views import APIView, Response
from .models import Exercise, ExerciseStatistics
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class ExerciseView(APIView):
    def post(self, request):
        data = request.data 
        """JSON Post must contain exercise_id in id field"""
        if "id" not in data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        id = data["id"]
        exercise = None
        if "perfect_reps" in data:
            exercise = Exercise.objects.get(pk=id)
            exercise.perfect_reps += data["perfect_reps"]
            exercise.save()
        
        return Response()
    
class ExerciseStatisticsView(APIView):
    def post(self, request):
        """Post request must contain both user and exercise foreign key
           It is a post request, not put because it is not idempotent
        """
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response("Please log in", status=status.HTTP_401_UNAUTHORIZED)
        data = request.data 
        user_id = request.user.id
        exercise_id = data.get("exercise_id", None)
        if user_id is None or exercise_id is None:
            return Response("Please put user_id and exercise_id",status=status.HTTP_400_BAD_REQUEST)
        perfect_reps = data.get("perfect_reps", None)
        if perfect_reps is None:
            return Response("Please put number of perfect reps done",status=status.HTTP_400_BAD_REQUEST)
        exercise_statistics = ExerciseStatistics.objects.filter(user=user_id).filter(exercise=exercise_id)
        if not exercise_statistics.exists():
            return Response("Entry does not exist.", status=status.HTTP_400_BAD_REQUEST)
        exercise_statistics = exercise_statistics[0]
        exercise_statistics.perfect_reps += perfect_reps
        exercise_statistics.save()
        return Response()
    
    def put(self, request):
        """View for users to send put request to create a new exercise statistic, is idempotent
        as .add does not create duplicate entries in through table"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response("Please log in.", status=status.HTTP_401_UNAUTHORIZED)
        data = request.data 
        exercise_id = data.get("exercise_id", None)
        if exercise_id is None:
            return Response("Please put an exercise id", status=status.HTTP_400_BAD_REQUEST)
        try:
            exercise = Exercise.objects.get(pk=exercise_id)
        except Exercise.DoesNotExist:
            return Response("Please put a valid exercise id", status=status.HTTP_400_BAD_REQUEST)
        request.user.exercises.add(exercise)
        return Response()
        
        
    
        