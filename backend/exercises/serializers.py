from rest_framework import serializers
from .models import ExerciseRegime

class ExerciseRegimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseRegime
        fields = '__all__'