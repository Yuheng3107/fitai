from rest_framework.views import APIView, Response
from .models import Exercise, ExerciseStatistics, ExerciseRegime
from .serializers import ExerciseRegimeSerializer, ExerciseSerializer
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class ExerciseUpdateView(APIView):
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
    
class ExerciseDetailView(APIView):
    """Creation and deletion of an exercise is done in admin console"""
    def get(self, request, pk):
        """To get data for an Exercise instance"""
        try:
            exercise = Exercise.objects.get(pk=pk)
            serializer = ExerciseSerializer(exercise)
            return Response(serializer.data)
            
            
        except Exercise.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
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
        # Requires id of exercise_regime
        if "id" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # exercises should not be updated in an exercise regime, otherwise it will break order etc
        
        # Add new fields to to the fields list for easy maintainance, 
        # fields are the fields that we allow the user to update
        # Exercises should not be modifiable so as to not break order
        
        fields = ["name", "text", "times_completed", "likes"]
        
        try:
            # Gets exercise regime
            exercise_regime = ExerciseRegime.objects.filter(pk=request.data["id"])
            if request.user != exercise_regime[0].poster:
                # Check that person is updating their own post, otherwise kick
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except ExerciseRegime.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        # Only updates fields that are sent in request
        fields = {field: request.data[field] for field in fields if field in request.data}
        exercise_regime.update(**fields)
        # tags is m2m (TODO)
        if "tags" in request.data:
            pass
        # media is base64 encoding that will need to be processed separately (TODO)
        
        # Linked media also need to handle separately (TODO)
        
        return Response()
    
    def post(self, request):
        """To create new exercise regime, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        # All these fields are required
        fields = ["name", "text", "exercises"]
        
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        
        fields = {field: request.data[field] for field in fields}
        # Unpack the dictionary and pass them as keyword arguments to create in Exercise Regime
        ExerciseRegime.objects.create(poster=request.user, **fields)
        
        
        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        """To get details of an exercise regime"""
        try:
            regime = ExerciseRegime.objects.get(pk=pk)
            serializer = ExerciseRegimeSerializer(regime)
            return Response(serializer.data)
            
            
        except ExerciseRegime.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
    
        try:
            regime = ExerciseRegime.objects.get(pk=pk)
            if (regime.poster != request.user):
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            regime.delete()
            return Response()
        except ExerciseRegime.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    