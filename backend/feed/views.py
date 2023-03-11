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
        
        fields = ["post_id"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        post = UserPost.objects.get(pk=request.post_id)
        if request.user != post.poster:
            return Response(f"Editing a post you did not create", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in fields}
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
        
        fields = ["text"]
        # Have to manually do for m2m fields
        # Check that all the required data is in the post request
        for field in fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)
        # if "media" in request.data:
            # Check for media type
            # if request.data["media"]
        fields = {field: request.data[field] for field in fields}
        # Unpack the dictionary and pass them as keyword arguments to create in UserPost
        post = UserPost.objects.create(poster=request.user, **fields)

        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        """To get details of a UserPost"""
        try:
            regime = UserPost.objects.get(pk=pk)
            serializer = UserPost(regime)
            return Response(serializer.data)
        except UserPost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
