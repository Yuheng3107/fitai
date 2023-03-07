from rest_framework import serializers
from .models import AppUser, Achievement

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['username', 'email', 'profile_photo', 'achievements']
        
        
class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["name", "description", "image"]