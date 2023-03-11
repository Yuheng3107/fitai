from rest_framework import serializers
from .models import Comment, UserPost, CommunityPost

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class UserPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPost
        fields = '__all__'

class CommunityPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = '__all__'