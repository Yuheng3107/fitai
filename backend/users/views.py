from rest_framework import status
from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model, login
from django.http import HttpResponse
from django.middleware.csrf import get_token
from .serializer import UserSerializer, OtherUserSerializer
from achievements.models import Achievement #type: ignore
from community.models import Community #type: ignore
from exercises.models import Exercise, ExerciseRegime #type: ignore
from chat.models import ChatGroup #type: ignore
from rest_framework.parsers import FormParser, MultiPartParser
from django.db.models import Count

User = get_user_model()
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
            print("User already in database")
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

class UserOthersDetailView(APIView):
    def get(self, request, pk):
        User = get_user_model()
        try:
            other_user = User.objects.get(pk=pk)
            serializer = OtherUserSerializer(other_user)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST) 

class UserOthersListView(APIView):
    def post(self, request):
        """To get details of multiple Users"""
        User = get_user_model()
        if "user_ids" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        users = User.objects.filter(pk__in=request.data["user_ids"])
        serializer = OtherUserSerializer(users, many=True)
        return Response(serializer.data)
        
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
        fields = ["username", "privacy_level", "email", "bio"]
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
        """
        file_name = uploaded_file_object.name
        start = file_name.rfind('.')
        allowed_formats = [".png", ".jpeg", ".jpg", ".webp"] 
        if file_name[start:] not in allowed_formats:
            return Response("File format is not allowed",status=status.HTTP_406_NOT_ACCEPTABLE)
        """
        # File size in Megabytes
        file_size = uploaded_file_object.size / (1024*1024)
        if file_size > 2:
            return Response("File size greater than 2MB", status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user.profile_photo = uploaded_file_object
        user.save()
        return Response()
        
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
        # User must be authenticated
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

class UserBlockedUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'blocked'
        
class UserFollowingUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'following'
        
class UserCommunitiesUpdateView(UserManyToManyUpdateView):
    def setup(self, request, *args, **kwargs):
        
        super().setup(request, *args, **kwargs)
        self.model = Community
        self.field_name = 'communities'
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Let super method validate data sent, only update member_count if it adding m2m is successful
        if response.status_code != status.HTTP_200_OK:
            return response
        pk_list = request.data.get("fk_list", None)
        if pk_list is not None:
            # Supposed to have one pk only
            pk = pk_list[0]
            update_community_member_count(1, pk)
        return response
            
        
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
        # Make sure user is authenticated
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
        
class UserFriendRequestDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'sent_friend_requests'

class UserBlockedDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'blocked'
        
class UserFollowingDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = get_user_model()
        self.field_name = 'following'
        
class UserCommunitiesDeleteView(UserManyToManyDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Community
        self.field_name = 'communities'
    def delete(self, request, pk, *args, **kwargs):
        response = super().delete(request, pk, *args, **kwargs)
        # Let super method validate data sent, only update member_count if removing m2m is successful
        if response.status_code != status.HTTP_200_OK:
            return response
        update_community_member_count(-1, pk)    
        return response
        
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
        
class UserFollowingListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(request.user.following.all(), many=True)
        return Response(serializer.data)
    
class UserFollowerListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(request.user.followers.all(), many=True)
        return Response(serializer.data)
    
class UserStreakUpdateView(APIView):
    def get(self, request):
        # Only logged in users can update their own streak
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Check if the user is active
        User = get_user_model()
        is_active = User.objects.filter(pk=request.user.id).values('active')[0]["active"]
        if is_active:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        else:
            request.user.active = True
            request.user.streak += 1
            if (request.user.streak > request.user.longest_streak):
                request.user.longest_streak = request.user.streak
            request.user.save()
            return Response("Successfully Updated")

class UserFriendRequestUpdatetView(APIView):
    def post(self, request):
         # Only logged in users can accept requests
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if "user_id" not in request.data:
            return Response(status.HTTP_400_BAD_REQUEST)
        id = request.data["user_id"]
        if request.user.following.values_list('id', flat=True).filter(id=id).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        request.user.sent_friend_requests.add(id)
        return Response("Successfully Added")

class UserFriendRequestAcceptView(APIView):
    def post(self, request):
         # Only logged in users can accept requests
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if "user_id" not in request.data:
            return Response(status.HTTP_400_BAD_REQUEST)
        id = request.data["user_id"]
        if not request.user.friend_requests.values_list('id', flat=True).filter(id=id).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        request.user.followers.add(id)
        request.user.following.add(id)
        request.user.friend_requests.remove(id)
        return Response("Successfully Added")

class UserFriendDeleteView(APIView):
    def delete(self, request, pk):
        """Delete Friend"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            request.user.followers.remove(pk)
            request.user.following.remove(pk)
            return Response()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

class UserFriendRequestDeclineView(APIView):
    def post(self, request):
         # Only logged in users can accept requests
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if "user_id" not in request.data:
            return Response(status.HTTP_400_BAD_REQUEST)
        id = request.data["user_id"]
        if not request.user.friend_requests.values_list('id', flat=True).filter(id=id).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        request.user.friend_requests.remove(id)
        return Response("Successfully Declined")

class UserSearchView(APIView):
    def post(self, request):
        required_fields = ["content"]
        for field in required_fields:
            if field not in request.data:
                return Response(f"Add the {field} field in POST request", status=status.HTTP_400_BAD_REQUEST)
        if request.data["content"] == "":
            return Response("Content cannot be empty", status.HTTP_400_BAD_REQUEST)
        qs = User.objects.filter(username__search=request.data["content"])
        user_count = qs.count()
        if user_count == 0:
            return Response("No users matching search terms found", status=status.HTTP_404_NOT_FOUND)
        elif user_count > 10:
            # Return top 10 users with most followers
            qs = qs[:10]
        serializer = UserSerializer(qs, many=True)
        return Response(serializer.data)

def update_community_member_count(num: int, pk: int):
    """
    Function to update community member_count whenever user joins or leaves a community
    Num is amount to increment (+ve) or decrement (-ve), pk is primary key of community
    """
    community = Community.objects.get(pk=pk)
    community.member_count += num
    community.save()

    