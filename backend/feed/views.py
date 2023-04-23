from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.contenttypes.models import ContentType

from .models import Comment, Tags, UserPost, CommunityPost
from community.models import Community #type: ignore
from .serializers import CommentSerializer, UserPostSerializer, CommunityPostSerializer

from datetime import datetime, timedelta, timezone
import itertools as it
import math
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.postgres.search import SearchVector
# Create your views here.

class UserPostCreateView(APIView):
    def post(self, request):
        """To create new user post"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text", "title"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data or request.data[field] == "":
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        
        create_fields = ["text", "privacy_level", "title"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in UserPost
        UserPost.objects.create(poster=request.user, **fields)
            
        return Response(status=status.HTTP_201_CREATED)

class UserPostUpdateView(APIView):
    def put(self, request):
        """To update user post"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data or request.data[field] == "":
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check post
        try:
            post = UserPost.objects.get(pk=request.data["id"])
        except UserPost.DoesNotExist:
            return Response("Please put a valid UserPost id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response("Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED) 

        # Check for valid content type
        update_fields = ["text", "privacy_level", "title"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to update in UserPost
        UserPost.objects.filter(pk=request.data["id"]).update(**fields)

        return Response(status=status.HTTP_200_OK)

class UserPostDetailView(APIView):
    def get(self, request, pk):
        """To get details of a UserPost"""
        try:
            post = UserPost.objects.get(pk=pk)
            serializer = UserPostSerializer(post)
            return Response(serializer.data)
        except UserPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UserPostListView(APIView):
    def post(self, request):
        if "user_posts" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user_posts = UserPost.objects.filter(pk__in=request.data["user_posts"])
        serializer = UserPostSerializer(user_posts, many=True)
        return Response(serializer.data)

class UserPostDeleteView(APIView):
    def delete(self, request, pk):
        try:
            post = UserPost.objects.get(pk=pk)
            if (post.poster != request.user):
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            post.delete()
            return Response()
        except UserPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


"""
Comment Views
"""
class CommentCreateView(APIView):
    def post(self, request):
        """To create new Comment"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text", "parent_type", "parent_id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data or request.data[field] == "":
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check for valid content type
        ct = None
        try:
            ct = ContentType.objects.get(pk=request.data["parent_type"])
        except ContentType.DoesNotExist:
            return Response("Please put a valid parent_type", status=status.HTTP_400_BAD_REQUEST)
        
        commentable_models = ['comment','userpost','communitypost','exercise','exerciseregime']
        if ct.model not in commentable_models:
            return Response("Parent Type not Commentable", status=status.HTTP_400_BAD_REQUEST)

        try:
            ct.get_object_for_this_type(pk=request.data["parent_id"])
        except:
            return Response("Please put a valid parent_id", status=status.HTTP_400_BAD_REQUEST)
        
        create_fields = ["text", "parent_id"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in Comment
        post = Comment.objects.create(poster=request.user, parent_type=ct, **fields)

        return Response(status=status.HTTP_201_CREATED)    

class CommentUpdateView(APIView):
    def put(self, request):
        """To update comment"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["text", "id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data or request.data[field] == "":
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check post
        try:
            post = Comment.objects.get(pk=request.data["id"])
        except Comment.DoesNotExist:
            return Response("Please put a valid Comment id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response("Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)

        update_fields = ["text"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in Comment
        Comment.objects.filter(pk=request.data["id"]).update(**fields)

        return Response(status=status.HTTP_200_OK)

class CommentDetailView(APIView):
    def get(self, request, pk):
        """To get details of a Comment"""
        try:
            post = Comment.objects.get(pk=pk)
            serializer = CommentSerializer(post)
            return Response(serializer.data)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CommentListView(APIView):
    def post(self, request):
        if "comments" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        comments = Comment.objects.filter(pk__in=request.data["comments"])
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentDeleteView(APIView):
    def delete(self, request, pk):
        try:
            post = Comment.objects.get(pk=pk)
            if (post.poster != request.user):
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            post.delete()
            return Response()
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

"""
CommunityPost Views
"""              
class CommunityPostCreateView(APIView):
    def post(self, request):
        """To create new community post"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text", "community_id", "title"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data or request.data[field] == "":
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        
        try:
            community = Community.objects.get(pk=request.data["community_id"])
        except Community.DoesNotExist:
            return Response("Please put a valid community id", status=status.HTTP_400_BAD_REQUEST)

        create_fields = ["text", "title"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in CommunityPost
        post = CommunityPost.objects.create(community=community, poster=request.user, **fields)

        return Response(status=status.HTTP_201_CREATED)

class CommunityPostUpdateView(APIView):
    def put(self, request):
        """To update community post"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data or request.data[field] == "":
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
                
        # Check post
        try:
            post = CommunityPost.objects.get(pk=request.data["id"])
        except CommunityPost.DoesNotExist:
            return Response("Please put a valid CommunityPost id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)

        update_fields = ["text"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in CommunityPost
        CommunityPost.objects.filter(pk=request.data["id"]).update(**fields)

        return Response(status=status.HTTP_200_OK)

class CommunityPostDetailView(APIView):
    def get(self, request, pk):
        """To get details of a CommunityPost"""
        try:
            post = CommunityPost.objects.get(pk=pk)
            serializer = CommunityPostSerializer(post)
            return Response(serializer.data)
        except CommunityPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CommunityPostListView(APIView):
    def post(self, request):
        """To get details of multiple CommunityPosts"""
        if "community_posts" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        community_posts = CommunityPost.objects.filter(pk__in=request.data["community_posts"])
        serializer = CommunityPostSerializer(community_posts, many=True)
        return Response(serializer.data)

class CommunityPostDeleteView(APIView):
    def delete(self, request, pk):
        try:
            post = CommunityPost.objects.get(pk=pk)
            if (post.poster != request.user):
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            post.delete()
            return Response()
        except CommunityPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


"""
PRESETS
"""
class TagsUpdateView(APIView):
    """Base class to update Tags for posts"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def post(self, request):
        """Adds new m2m relationships to model"""
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        check_fields = ["tags","id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
       
        try:
            post = self.model.objects.get(pk=request.data['id'])
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)

        
        # Adds the relations to the model
        try:
            # Unpacks foreign keys in fk_list
            post.tags.add(*request.data["tags"])
            return Response()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class LikesUpdateView(APIView):
    """Base class to update likes for posts"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def post(self, request):
        """Adds new m2m relationships to user model"""
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        check_fields = ["id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
       
        try:
            post = self.model.objects.get(pk=request.data['id'])
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        
        # Adds the relations to the model
        try:
            post.likers.add(request.user)
            post.likes = post.likes + 1
            post.save()
            return Response()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class TagsDeleteView(APIView):
    """Base class to delete Tags for posts"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def delete(self, request, pk_post, tag_name):
        """deletes m2m relationships to model"""
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:            
            post = self.model.objects.get(pk=pk_post)
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)
        
        # Adds the relations to the model
        try:
            # Unpacks foreign keys in fk_list
            post.tags.remove(tag_name)
            return Response()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class LikesDeleteView(APIView):
    """Base class to delete likes for posts"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def delete(self, request, pk):
        """removes m2m relationships to user model"""
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
       
        try:
            post = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        
        # Adds the relations to the model
        try:
            post.likers.remove(request.user)
            post.likes = post.likes - 1
            post.save()
            return Response()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ShareUpdateView(APIView):
    """Base class to update likes for posts"""
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def post(self, request):
        """Adds new m2m relationships to model"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        fields = ["id","shared_type","shared_id"]
        # Check that all the required data is in the post request
        for field in fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        #check for post
        try:
            post = self.model.objects.get(pk=request.data['id'])
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response("Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)
        
        # check for shared type
        try:
            ct = ContentType.objects.get(pk=request.data["shared_type"])
        except ContentType.DoesNotExist:
            return Response("Please put a valid shared_type", status=status.HTTP_400_BAD_REQUEST)
        # check that model is sharable
        sharable_models = ['comment','userpost','communitypost','exercise','exerciseregime','user','achievement']
        if ct.model not in sharable_models:
            return Response("Parent Type not sharable", status=status.HTTP_400_BAD_REQUEST)
        # check for shared id
        try:
            ct.get_object_for_this_type(pk=request.data["shared_id"])
        except:
            return Response("Please put a valid shared_id", status=status.HTTP_400_BAD_REQUEST)

        self.model.objects.filter(pk=request.data["id"]).update(shared_type=ct, shared_id=request.data["shared_id"])

        return Response()

class ShareDeleteView(APIView):
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)
    
    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        #check for post
        try:
            post = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response("Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)
        
        post.shared_type = None
        post.shared_id = None
        post.save()
        return Response()

class MediaUpdateView(APIView):
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)

    def post(self, request):
        parser_classes = [FormParser, MultiPartParser]
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        fields = ["id"]
        # Check that all the required data is in the post request
        for field in fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        #check for post
        try:
            post = self.model.objects.get(pk=request.data['id'])
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response("Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)
        
        uploaded_file_object = request.FILES.get("photo", None)
        # Check that profile photo is indeed uploaded
        if uploaded_file_object is None:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        file_name = uploaded_file_object.name
        start = file_name.rfind('.')
        allowed_formats = [".png", ".jpeg", ".jpg", ".webp", ".mp4", ".mov", ".webm", ".gif"] 
        if file_name[start:] not in allowed_formats:
            return Response("File format is not allowed",status=status.HTTP_406_NOT_ACCEPTABLE)
        # File size in Megabytes
        file_size = uploaded_file_object.size / (1024*1024)
        if file_size > 2:
            return Response("File size greater than 2MB", status=status.HTTP_400_BAD_REQUEST)

        post.media = uploaded_file_object
        post.save()
        return Response()

class MediaDeleteView(APIView):
    def setup(self, request, *args, **kwargs):
        # Model is the model of the object with m2m relationship with tags
        self.model = None
        # This attribute will need to be overwritten in the descendant class
        return super().setup(self, request, *args, **kwargs)

    def delete(self, request, pk):        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # Checks that there is a model setup
        if self.model is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        #check for post
        try:
            post = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return Response("Please put a valid Post id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response("Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)
        
        post.media = None
        post.save()
        return Response()


"""
PRESET CLASSES
"""
class UserPostTagsUpdateView(TagsUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class UserPostTagsDeleteView(TagsDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class UserPostLikesUpdateView(LikesUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost  

class UserPostLikesDeleteView(LikesDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class UserPostShareUpdateView(ShareUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class UserPostShareDeleteView(ShareDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class UserPostMediaUpdateView(MediaUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class UserPostMediaDeleteView(MediaDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = UserPost

class CommunityPostTagsUpdateView(TagsUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostTagsDeleteView(TagsDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostLikesUpdateView(LikesUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostLikesDeleteView(LikesDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostShareUpdateView(ShareUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostShareDeleteView(ShareDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostMediaUpdateView(MediaUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommunityPostMediaDeleteView(MediaDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = CommunityPost

class CommentLikesUpdateView(LikesUpdateView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Comment

class CommentLikesDeleteView(LikesDeleteView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.model = Comment
        
class LatestUserPostView(APIView):
    def post(self, request):
        """Returns 10 most recent posts, taking into account posts user has already loaded"""
        if "set_no" not in request.data or "user_id" not in request.data:
            return Response(status.HTTP_400_BAD_REQUEST)
        set_no = request.data["set_no"]
        set_size = 10
        start = set_no * set_size
        try:
            latest_posts_qs = UserPost.objects.filter(poster=request.data["user_id"]).order_by('-id')[start:start+set_size]
            serializer = UserPostSerializer(latest_posts_qs, many=True)
            return Response(serializer.data)
        except:
            return Response("No more posts", status=status.HTTP_404_NOT_FOUND)

class LatestCommunityPostView(APIView):
    def post(self, request):
        """Returns 10 most recent posts, taking into account posts user has already loaded"""
        if "set_no" not in request.data or "community_id" not in request.data:
            return Response(status.HTTP_400_BAD_REQUEST)
        set_no = request.data["set_no"]
        set_size = 10
        start = set_no * set_size
        try:
            latest_posts_qs = CommunityPost.objects.filter(community=request.data["community_id"]).order_by('-id')[start:start+set_size]
            serializer = CommunityPostSerializer(latest_posts_qs, many=True)
            return Response(serializer.data)
        except:
            return Response("No more posts", status=status.HTTP_404_NOT_FOUND)

class UserFeedView(APIView):
    def post(self,request):
        """Returns posts for the day"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if "set_no" not in request.data:
            return Response(status.HTTP_400_BAD_REQUEST)
        set_no = request.data["set_no"]
        # Calculate the start and end times for the most recent day
        end_time = (datetime.today() - timedelta(days=set_no)).replace(tzinfo=timezone.utc)
        start_time = (end_time - timedelta(days=1)).replace(tzinfo=timezone.utc)

        # Filter for events that occurred within the most recent day
        friends = request.user.following.values_list('id', flat=True)
        communities = request.user.communities.values_list('id', flat=True)
        friend_posts = UserPostSerializer(UserPost.objects.filter(poster__in=friends, posted_at__range=(start_time, end_time)).order_by("-id"), many=True).data
        community_posts = CommunityPostSerializer(CommunityPost.objects.filter(community__in=communities, posted_at__range=(start_time, end_time)).order_by("-likes")[0:10], many=True).data
        followed = list(it.chain(friend_posts, community_posts))
        # recommended
        recommended_no = math.floor(len(followed)/4)
        recommended_friends = UserPostSerializer(UserPost.objects.filter(posted_at__range=(start_time, end_time)).exclude(poster__in=friends).order_by("-likes")[0:recommended_no], many=True).data
        recommended_community = CommunityPostSerializer(CommunityPost.objects.filter(posted_at__range=(start_time, end_time)).exclude(community__in=communities).order_by("-likes")[0:recommended_no], many=True).data

        #stitch
        data = list(it.chain(followed, recommended_friends, recommended_community))
        return Response(data)
    
class CommunityPostSearchView(APIView):
    def post(self, request):
        required_fields = ["content", "community_id"]
        for field in required_fields:
            if field not in request.data:
                return Response(f"Add the {field} field in POST request", status=status.HTTP_400_BAD_REQUEST)
        if request.data["content"] == "":
            return Response("Content cannot be empty", status.HTTP_400_BAD_REQUEST)
        qs = CommunityPost.objects.filter(community=request.data["community_id"]).annotate(search=SearchVector("title", "text"),).filter(search=request.data["content"]).order_by('-likes')
        """
        # Split sentence of search into respective keywords
        keywords = request.data["content"].split()
        # Generate queries for checking if keywords in title and for checking if keywords in content of post
        title_query = None
        text_query = None
        for keyword in keywords:
            if title_query is None:
                # Initialise title query to Q object for first query
                title_query = Q(title__icontains=keyword)
            else:
                # Chain the queries so that final query filters for Communities with titles containing all the keywords
                title_query = title_query & Q(title__icontains=keyword)
            # Likewise for text_query
            if text_query is None:
                text_query = Q(text__icontains=keyword)
            else:
                text_query = text_query & Q(text__icontains=keyword)
        
        qs = CommunityPost.objects.filter(community=request.data["community_id"]).filter(title_query | text_query).order_by('-likes')"""
        post_no = qs.count()
        if post_no == 0:
            return Response("No posts found")
        if post_no > 10:
            # Get top 10 most liked posts if there are more than 10 posts
            qs = qs[:10]
        serializer = CommunityPostSerializer(qs, many=True)
        return Response(serializer.data)
        
class UserPostSearchView(APIView):
    def post(self, request):
        required_fields = ["content", "user_id"]
        for field in required_fields:
            if field not in request.data:
                return Response(f"Add the {field} field in POST request", status=status.HTTP_400_BAD_REQUEST)
        if request.data["content"] == "":
            return Response("Content cannot be empty", status.HTTP_400_BAD_REQUEST)
        qs = UserPost.objects.filter(user=request.data["user_id"]).annotate(search=SearchVector("title", "text"),).filter(search=request.data["content"]).order_by('-likes')
        post_no = qs.count()
        if post_no == 0:
            return Response("No posts found")
        if post_no > 10:
            # Get top 10 most liked posts if there are more than 10 posts
            qs = qs[:10]
        serializer = UserPostSerializer(qs, many=True)
        return Response(serializer.data)