from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Exercise, ExerciseStatistics, ExerciseRegime
from model_bakery import baker
import json
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
    def setUp(self):
        self.url = reverse('exercise_statistics')
        
    def test_update_exercise_statistics(self):
        """Test that we can update exercise statistics"""
        exercise = baker.make(Exercise)
        user = baker.make('users.AppUser')
        user.exercises.add(exercise)
        perfect_reps_increase = 20
        data = {
            "exercise_id": exercise.id,
            "perfect_reps": perfect_reps_increase
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        # Check that perfect reps change once user is authenticated
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(ExerciseStatistics.objects.filter(user=user.id).filter(exercise=exercise.id)[0].perfect_reps, perfect_reps_increase)
        # Check that view denies malformed requests
        data = {}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {
            "user_id": user.id,
            "exercise_id": exercise.id,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_exercise_statistics(self):
        """Test we can create exercise statistics"""
        exercise = baker.make(Exercise)
        data = {
            "exercise_id": exercise.id
        }
        # Test that it will deny unauthorised access (not logged in)
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        user = baker.make('users.AppUser')
        self.client.force_authenticate(user=user)
        # Check that we make a new exercise statistic
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        exercise_statistic = ExerciseStatistics.objects.filter(user=user.id).filter(exercise=exercise.id)
        # Check that it only makes one exercise statistic
        self.assertEqual(len(exercise_statistic), 1)
        
        
class ExerciseRegimeViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('exercise_regime')
        
    def test_create_exercise_regime(self):
        poster = baker.make('users.AppUser')
        name = "Exercise Regime Name"
        description = "Exercise Regime Description"
        exercises = []
        for i in range(3):
            exercise = baker.make(Exercise)
            exercises.append(exercise.id)
        data = {
            "name": name,
            "description": description, 
            "exercises": exercises
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=poster)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_regime = ExerciseRegime.objects.filter(name=name).filter(description=description)
        self.assertTrue(created_regime.exists())
        self.assertEqual(len(created_regime), 1)
        created_regime = created_regime[0]
        self.assertEqual(created_regime.poster, poster)
        self.assertEqual(created_regime.description, description)
        self.assertEqual(created_regime.name, name)
        # Exercise works
        new_exercises = [exercise.id for exercise in created_regime.exercises.all()]
        self.assertEqual(exercises, new_exercises)
    
    def test_get_exercise_regime(self):
        exercise_regime = baker.make(ExerciseRegime)
        url = reverse('exercise_regime', kwargs={"pk": exercise_regime.id})
        response = self.client.get(url)
        content = json.loads(response.content)
        # Content is now a dict
        self.assertEqual(content["id"], exercise_regime.id)
        self.assertEqual(content["name"], exercise_regime.name)
        self.assertEqual(content["description"], exercise_regime.description)
        self.assertEqual(content["times_completed"], exercise_regime.times_completed)
        self.assertEqual(content["poster"], exercise_regime.poster)
        self.assertEqual(content["likers"], list(exercise_regime.likers.all()))
        self.assertEqual(content["exercises"], list(exercise_regime.exercises.all()))
    