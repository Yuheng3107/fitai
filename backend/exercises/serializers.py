from rest_framework import serializers
from .models import ExerciseRegime, Exercise, ExerciseStatistics

class ExerciseRegimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseRegime
        fields = '__all__'
        
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'
        
class ExerciseStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseStatistics
        exclude = ['user', 'exercise', 'id']