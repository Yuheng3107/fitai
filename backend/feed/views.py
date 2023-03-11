from django.shortcuts import render
from rest_framework.views import APIView, Response
from .models import Comment, UserPost, CommunityPost
from .serializers import CommentSerializer, UserPostSerializer, CommunityPostSerializer
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class UserPostView(APIView):
    def put(self, request):
        """To update user post"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["post_id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        update_fields = ["text", "media", "shared_type", "shared_id", "tags"]
        post = UserPost.objects.get(pk=request.post_id)
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in UserPost
        post = UserPost.objects.update(**fields)
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
        
        create_fields = ["text", "media", "shared_type", "shared_id", "tags"]
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
        
        check_fields = ["post_id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        update_fields = ["text"]
        post = Comment.objects.get(pk=request.post_id)
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in Comment
        post = Comment.objects.update(**fields)
        post.save()

        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        """To create new user post, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # if "media" in request.data:
            # Check for media type
            # if request.data["media"]
        
        create_fields = ["text"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in Comment
        post = Comment.objects.create(poster=request.user, **fields)

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
        
        check_fields = ["post_id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # check if community post exists?
        update_fields = ["text", "media", "shared_type", "shared_id", "tags"]
        post = CommunityPost.objects.get(pk=request.post_id)
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in CommunityPost
        post = CommunityPost.objects.update(**fields)
        post.save()

        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        """To create new user post, user needs to be authenticated"""
        authentication_classes = [SessionAuthentication, BasicAuthentication]
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["text", "community"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # if "media" in request.data:
            # Check for media type
            # if request.data["media"]
        
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
