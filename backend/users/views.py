from rest_framework import status
from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model, login
from django.http import HttpResponse
from django.middleware.csrf import get_token
from .serializer import UserSerializer
from achievements.models import Achievement #type: ignore
from community.models import Community #type: ignore
from exercises.models import Exercise, ExerciseRegime #type: ignore
from rest_framework.renderers import JSONRenderer

class UserCreateView(APIView):
    def post(self, request):
        """API used internally to create users in DB from social logins"""
        # Need to serialize data
        fields = ["first_name", "last_name", "email"]
        # Ensures all fields are there
        for field in fields:
            if field not in request.data:
                return Response(f"Please input data into {field}", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in fields}
        fields["username"] = f"{fields['first_name']} {fields['last_name']}"
        User = get_user_model()
        response = HttpResponse()
        csrf_token = get_token(request)
        try:
            user = User.objects.get(email=fields["email"])
            login(request, user)
            response.write("User already in database")
            return response
        except User.DoesNotExist:
            user = User.objects.create_user(**fields)
            user.save()
            login(request, user)
            response.write("User Successfully Registered")
        return response
    
class UserDetailView(APIView):
    def get(self, request):
        if (request.user.is_authenticated):
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        else:
            return Response(False, status=status.HTTP_401_UNAUTHORIZED)
    
        
class CheckLoginStatus(APIView):
    def get(self, request):
        return Response(request.user.is_authenticated)
    
class UserUpdateView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        fields = ["username", "privacy_level"]

class UserManyToManyUpdateView(APIView):
    """Base class to update m2m relationships for users"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with users
        self.model = None
        # Field name is the name of the field with m2m relationship with users
        self.field_name = None
        # These two attributes will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def post(self, request):
        """Adds new m2m relationships to user model"""
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None or self.field_name is None:
            print(self.model)
            print(self.field_name)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if "fk_list" not in request.data:
            return Response("Please add list of foreign keys as fk_list in request.", status=status.HTTP_400_BAD_REQUEST)
       
    
        # Adds the relations to the model
        try:
            # Unpacks foreign keys in fk_list
            getattr(request.user, self.field_name).add(*request.data["fk_list"])
            return Response()
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserAchievementUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Achievement
        self.field_name = 'achievements'
        
class UserFriendsUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'friends'

class UserCommunitiesUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Community
        self.field_name = 'communities'
        
class UserExercisesUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Exercise
        self.field_name = 'exercises'
        
