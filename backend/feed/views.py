from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType

from .models import Comment, UserPost, CommunityPost
from community.models import Community #type: ignore
from .serializers import CommentSerializer, UserPostSerializer, CommunityPostSerializer
# Create your views here.

class UserPostView(APIView):
    def put(self, request):
        """To update user post"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["text", "id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check post
        post = None
        try:
            post = UserPost.objects.get(pk=request.data["id"])
        except UserPost.DoesNotExist:
            return Response("Please put a valid UserPost id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED) 

        update_fields = ["text", "media", "shared_type", "shared_id", "tags"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in UserPost
        UserPost.objects.update(**fields)
        post.save()

        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        """To create new user post, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # if "media" in request.data:
            # Check for media type
            # if request.data["media"]
        
        # SHARED ID, CHECK CONTENT TYPE
        create_fields = ["text", "media", "shared_id", "tags"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in UserPost
        post = UserPost.objects.create(poster=request.user, **fields)

        # Adding tags
        tags_qs = UserPost.objects.filter(pk__in=request.data["tags"])
        try:
            post.tags.add(*list(tags_qs))
        except ValueError:
            return Response("Cannot add exercise that doesn't exist", status=status.HTTP_400_BAD_REQUEST)
            
        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        """To get details of a UserPost"""
        try:
            post = UserPost.objects.get(pk=pk)
            serializer = UserPostSerializer(post)
            return Response(serializer.data)
        except UserPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CommentView(APIView):
    def put(self, request):
        """To update comment"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["text", "id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check post
        post = None
        try:
            post = Comment.objects.get(pk=request.data["id"])
        except Comment.DoesNotExist:
            return Response("Please put a valid Comment id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)

        update_fields = ["text"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in Comment
        Comment.objects.filter(pk=request.data["id"]).update(**fields)

        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        """To create new Comment, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
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
        # Check for media type
            # Check for media type
            # if request.data["media"]
        
        create_fields = ["text", "parent_id"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in Comment
        post = Comment.objects.create(poster=request.user, parent_type=ct, **fields)

        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        """To get details of a Comment"""
        try:
            post = Comment.objects.get(pk=pk)
            serializer = CommentSerializer(post)
            return Response(serializer.data)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
class CommunityPostView(APIView):
    def put(self, request):
        """To update user post"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["text", "id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
                
        # Check post
        post = None
        try:
            post = CommunityPost.objects.get(pk=request.data["id"])
        except CommunityPost.DoesNotExist:
            return Response("Please put a valid CommunityPost id", status=status.HTTP_404_NOT_FOUND)
        # Check User
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_401_UNAUTHORIZED)

        # SHARED ID, CHECK CONTENT TYPE
        update_fields = ["text", "media", "shared_id", "tags"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in CommunityPost
        CommunityPost.objects.update(**fields)
        post.save()

        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        """To create new user post, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text", "community_id"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # if "media" in request.data:
            # Check for media type
            # if request.data["media"]
            
        try:
            community = Community.objects.get(pk=request.data["community_id"])
        except Community.DoesNotExist:
            return Response("Please put a valid community id", status=status.HTTP_400_BAD_REQUEST)
        create_fields = ["text", "media", "shared_type", "shared_id", "tags", "community"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in CommunityPost
        post = CommunityPost.objects.create(poster=request.user, **fields)

        # Adding tags
        post_qs = CommunityPost.objects.filter(pk__in=request.data["tags"])
        try:
            post.tags.add(*list(post_qs))
        except ValueError:
            return Response("Cannot add exercise that doesn't exist", status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)

    
    def get(self, request, pk):
        """To get details of a CommunityPost"""
        try:
            post = CommunityPost.objects.get(pk=pk)
            serializer = CommunityPostSerializer(post)
            return Response(serializer.data)
        except CommunityPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
