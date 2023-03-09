from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Exercise, ExerciseStatistics
from model_bakery import baker
# Create your tests here.
class ExerciseViewTests(APITestCase):
    def test_update_exercise_data(self):
        """Ensure we can update data in Exercise Model"""
        url = reverse('exercise_data')
        exercise = baker.make(Exercise)
        perfect_reps_increase = 10
        data = {
            "id": exercise.id,
            "perfect_reps": perfect_reps_increase
            }
        current_reps = exercise.perfect_reps
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Exercise.objects.get(pk=exercise.id).perfect_reps, current_reps+perfect_reps_increase)
        # Test that view will return status code 400 when id is not in data
        data = {
            "perfect_reps": perfect_reps_increase
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ExerciseStatisticsViewTests(APITestCase):
    def test_update_exercise_statistics(self):
        """Test that we can update exercise statistics"""
        url = reverse('exercise_statistics')
        exercise = baker.make(Exercise)
        user = baker.make('users.AppUser')
        user.exercises.add(exercise)
        perfect_reps_increase = 20
        data = {
            "user_id": user.id,
            "exercise_id": exercise.id,
            "perfect_reps": perfect_reps_increase
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ExerciseStatistics.objects.filter(user=user.id).filter(exercise=exercise.id)[0].perfect_reps, perfect_reps_increase)
