from .models import Achievement
from rest_framework import serializers

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["name", "description", "image"]