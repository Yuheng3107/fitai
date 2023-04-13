
from rest_framework import serializers
from .models import AppUser

class UserSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)
    class Meta:
        model = AppUser
        fields = ["username", "profile_photo", "achievements", "bio", "exercise_regimes", "exercises", "calories_burnt", "followers", "reps", "perfect_reps", "email"]

