from rest_framework import status
from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model, login
from django.http import HttpResponse
from django.middleware.csrf import get_token
from .serializer import UserSerializer
from achievements.models import Achievement #type: ignore
from community.models import Community #type: ignore
from exercises.models import Exercise, ExerciseRegime #type: ignore
from chat.models import ChatGroup #type: ignore
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import FormParser, MultiPartParser

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

class UserAllowedView(APIView):
    def post(self, request):
        if "username" not in request.data or "email" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        User = get_user_model()
        if User.objects.filter(email=request.data["email"]).exists() or User.objects.filter(username=request.data["username"]).exists():
            return Response(False)
        return Response(True)
    
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
        """Post normal fields here"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if (len(request.data) == 0 or "id" in request.data):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        fields = ["username", "privacy_level", "email"]
        fields = {field: request.data[field] for field in fields if field in request.data}
        User = get_user_model()
        # Update the user with the new fields
        try:
            User.objects.filter(pk=request.user.id).update(**fields)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        return Response()

class UserUpdateProfilePhotoView(APIView):
    def post(self, request):
        parser_classes = [FormParser, MultiPartParser]
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        uploaded_file_object = request.FILES.get("photo", None)
        # Check that profile photo is indeed uploaded
        if uploaded_file_object is None:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        user = request.user
        user.profile_photo = uploaded_file_object
        user.save()
        return Response()
        # Process byte data here
        
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
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if "fk_list" not in request.data:
            return Response("Please add list of foreign keys as fk_list in request.", status=status.HTTP_400_BAD_REQUEST)
       
    
        # Adds the relations to the model
        try:
            # Unpacks foreign keys in fk_list
            getattr(request.user, self.field_name).add(*request.data["fk_list"])
            return Response()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

class UserAchievementsUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Achievement
        self.field_name = 'achievements'
        
class UserFriendsUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'friends'

class UserBlockedUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'blocked'

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

class UserExerciseRegimesUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = ExerciseRegime
        self.field_name = 'exercise_regimes'
        
class UserChatGroupsUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = ChatGroup
        self.field_name = 'chat_groups'

class UserManyToManyDeleteView(APIView):
    """Base class to delete m2m relationships for users"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with users
        self.model = None
        # Field name is the name of the field with m2m relationship with users
        self.field_name = None
        # These two attributes will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def delete(self, request, pk):
        """Delete m2m relationship"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None or self.field_name is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            getattr(request.user, self.field_name).remove(pk)
            return Response()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

class UserAchievementsDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Achievement
        self.field_name = 'achievements'
        
class UserFriendsDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'friends'

class UserBlockedDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'blocked'

class UserCommunitiesDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Community
        self.field_name = 'communities'
        
class UserExercisesDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Exercise
        self.field_name = 'exercises'

class UserExerciseRegimesDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = ExerciseRegime
        self.field_name = 'exercise_regimes'
        
class UserChatGroupsDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = ChatGroup
        self.field_name = 'chat_groups'