from rest_framework.views import APIView, Response
from .models import Exercise, ExerciseStatistics, ExerciseRegime
from .serializers import ExerciseRegimeSerializer, ExerciseSerializer
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class ExerciseView(APIView):
    def patch(self, request):
        data = request.data 
        """To increment staistics to an exercise"""
        """JSON must contain exercise_id in id field"""
        if "id" not in data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        id = data["id"]
        exercise = None
        if "perfect_reps" in data:
            exercise = Exercise.objects.get(pk=id)
            exercise.perfect_reps += data["perfect_reps"]
            exercise.save()
        
        return Response()
    
    def get(self, request, pk):
        """To get data for an Exercise instance"""
        try:
            exercise = Exercise.objects.get(pk=pk)
            serializer = ExerciseSerializer(exercise)
            return Response(serializer.data)
        except Exercise.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)
    
class ExerciseStatisticsView(APIView):
    def post(self, request):
        """ To update (increment) exercise statistics
            Post request must contain both user and exercise foreign key
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
        
class ExerciseRegimeView(APIView):
    def put(self, request):
        """To update exercise regime"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if "id" in request.data:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        # exercises should not be updated in an exercise regime
        fields = ["name", "text", "times_completed"]
        m2m_fields = []
        
        fields = ["name", "description", "exercises"]
    
    def post(self, request):
        """To create new exercise regime, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        fields = ["name", "text"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        if "exercises" not in request.data:
            return Response("Please add exercises to the exercise regime", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in fields}
        # Unpack the dictionary and pass them as keyword arguments to create in Exercise Regime
        regime = ExerciseRegime.objects.create(poster=request.user, **fields)
        exercises_qs = Exercise.objects.filter(pk__in=request.data["exercises"])
        try:
            regime.exercises.add(*list(exercises_qs))
        except ValueError:
            return Response("Cannot add exercise that doesn't exist", status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        """To get details of an exercise regime"""
        try:
            regime = ExerciseRegime.objects.get(pk=pk)
            serializer = ExerciseRegimeSerializer(regime)
            return Response(serializer.data)
        except ExerciseRegime.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    