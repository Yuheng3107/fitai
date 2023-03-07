from rest_framework import serializers
from .models import AppUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['username', 'email', 'profile_photo', 'achievements']