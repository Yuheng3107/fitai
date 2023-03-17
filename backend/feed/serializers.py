from rest_framework import serializers
from .models import Comment, UserPost, CommunityPost

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class UserPostSerializer(serializers.ModelSerializer):
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = UserPost
        fields = '__all__'

class CommunityPostSerializer(serializers.ModelSerializer):
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = CommunityPost
        fields = '__all__'