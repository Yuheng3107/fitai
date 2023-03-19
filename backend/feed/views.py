from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.contenttypes.models import ContentType

from .models import Comment, Tags, UserPost, CommunityPost
from community.models import Community #type: ignore
from .serializers import CommentSerializer, UserPostSerializer, CommunityPostSerializer
# Create your views here.

class UserPostCreateView(APIView):
    def post(self, request):
        """To create new user post"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        
        # if "media" in request.data (TODO):
            # Check for media type
            # if request.data["media"]
        
        create_fields = ["text", "shared_id", "privacy_level"]
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
            if field not in request.data:
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
        update_fields = ["text", "privacy_level"]
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
            if field not in request.data:
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
        # Check for media type (TODO)
            # Check for media type
            # if request.data["media"]
        
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
            if field not in request.data:
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
        
        check_fields = ["text", "community_id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # if "media" in request.data (TODO):
            # Check for media type
            # if request.data["media"]
        
        try:
            community = Community.objects.get(pk=request.data["community_id"])
        except Community.DoesNotExist:
            return Response("Please put a valid community id", status=status.HTTP_400_BAD_REQUEST)

        create_fields = ["text"]
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
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
                
        # Check post
        try:
            post = CommunityPost.objects.get(pk=request.data["id"])
        except CommunityPost.DoesNotExist:
            return Response("Please put a valid CommunityPost id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)

        # Check for valid content type
       
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