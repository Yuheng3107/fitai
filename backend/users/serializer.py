
from rest_framework import serializers
from .models import AppUser

class UserSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)
    class Meta:
        model = AppUser
        # To add more sensitive data
        fields = ["id", "username", "profile_photo", "achievements", "bio", "exercise_regimes", "exercises", "calories_burnt", "followers", "reps", "perfect_reps", "email", "streak", "active", "friend_requests", "sent_friend_requests", "communities"]

class OtherUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ["id", "username", "profile_photo", "achievements", "bio", "exercise_regimes", "exercises", "calories_burnt", "followers", "reps", "perfect_reps", "email", "streak", "communities"]
        