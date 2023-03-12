# TestCase
from django.test import TestCase
from django.contrib.auth import get_user_model
from model_bakery import baker
from django.core.files.uploadedfile import SimpleUploadedFile
import os
# API TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import json

from .models import Exercise, ExerciseStatistics, ExerciseRegime

# Create your tests here.
class ExerciseTestCase(TestCase):
    def test_create_exercise(self):
        User = get_user_model()
        user = baker.make(User)
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x01\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        media = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        content = 'Lorem Ipsum blablabla'
        name = 'Test Exercise'
        baker.make(
            Exercise,
            name = name,
            text = content,
            media = media,
            poster = user,
        )
        exercise = Exercise.objects.get()
        self.assertEqual(exercise.name, name)
        self.assertEqual(exercise.text, content)
        self.assertEqual(exercise.media.name, media.name)
        self.assertEqual(exercise.poster, user)
        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_delete_exercise(self):
        """Test that exercise can be deleted properly"""
        exercise = baker.make(Exercise)
        Exercise.objects.get(pk=exercise.id).delete()
        with self.assertRaises(Exercise.DoesNotExist):
            Exercise.objects.get(pk=exercise.id)

    def test_delete_founder(self):
        """To test whether exercise is not deleted after founder is deleted"""
        User = get_user_model()
        user = baker.make(User)
        exercise = baker.make(Exercise,poster=user)
        self.assertIsInstance(exercise, Exercise)
        exercise_id = exercise.id
        User.objects.get(pk=user.id).delete()
        updated_exercise =  Exercise.objects.get(pk=exercise.id)
        self.assertEqual(updated_exercise.id, exercise_id)
        self.assertEqual(updated_exercise.poster, None)

    def test_update_exercise(self):
        """Test that exercise can be updated"""
        exercise = baker.make(Exercise)
        updated_content = "New Description Content"
        exercise.text = updated_content
        exercise.save()
        updated_exercise = Exercise.objects.get(pk=exercise.id)
        self.assertEqual(updated_exercise.text, updated_content)
        
        

# Create your tests here.
class ExerciseRegimeTestCase(TestCase):
    def test_create_exercise_regime(self):
        User = get_user_model()
        user = baker.make(User)
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x01\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        media = SimpleUploadedFile(
            'small2.gif', small_gif, content_type='image/gif')
        content = 'Lorem Ipsum blablabla'
        name = 'Test ExerciseRegime'
        baker.make(
            ExerciseRegime,
            name = name,
            text = content,
            media = media,
            poster = user,
        )
        exercise_regime = ExerciseRegime.objects.get()
        self.assertEqual(exercise_regime.name, name)
        self.assertEqual(exercise_regime.text, content)
        self.assertEqual(exercise_regime.media.name, media.name)
        self.assertEqual(exercise_regime.poster, user)

        # many to many check
        exercise = baker.make(Exercise)
        exercise_regime.exercises.add(exercise)
        for x in exercise_regime.exercises.all():
            self.assertEqual(x,exercise)

        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_delete_exercise_regime(self):
        """Test that exercise_regime can be deleted properly"""
        exercise_regime = baker.make(ExerciseRegime)
        ExerciseRegime.objects.get(pk=exercise_regime.id).delete()
        with self.assertRaises(ExerciseRegime.DoesNotExist):
            ExerciseRegime.objects.get(pk=exercise_regime.id)

    def test_delete_founder(self):
        """To test whether exercise_regime is not deleted after founder is deleted"""
        User = get_user_model()
        user = baker.make(User)
        exercise_regime = baker.make(ExerciseRegime,poster=user)
        self.assertIsInstance(exercise_regime, ExerciseRegime)
        exercise_regime_id = exercise_regime.id
        User.objects.get(pk=user.id).delete()
        updated_exercise_regime =  ExerciseRegime.objects.get(pk=exercise_regime.id)
        self.assertEqual(updated_exercise_regime.id, exercise_regime_id)
        self.assertEqual(updated_exercise_regime.poster, None)

    def test_update_exercise_regime(self):
        """Test that exercise_regime can be updated"""
        exercise_regime = baker.make(ExerciseRegime)
        updated_content = "New Description Content"
        exercise_regime.text = updated_content
        exercise_regime.save()
        updated_exercise_regime = ExerciseRegime.objects.get(pk=exercise_regime.id)
        self.assertEqual(updated_exercise_regime.text, updated_content)

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
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Exercise.objects.get(pk=exercise.id).perfect_reps, current_reps+perfect_reps_increase)
        # Test that view will return status code 400 when id is not in data
        data = {
            "perfect_reps": perfect_reps_increase
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_get_exercise(self):
        exercise = baker.make(Exercise)
        url = reverse('exercise_data', kwargs={"pk": exercise.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data["likes"], exercise.likes)
        self.assertEqual(data["text"], exercise.text)
        self.assertEqual(data["name"], exercise.name)
        self.assertEqual(data["perfect_reps"], exercise.perfect_reps)
        url = reverse('exercise_data', kwargs={"pk": 69})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
        

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
        text = "Exercise Regime Description"
        exercises = []
        for i in range(3):
            exercise = baker.make(Exercise)
            exercises.append(exercise.id)
        data = {
            "name": name,
            "text": text, 
            "exercises": exercises
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=poster)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_regime = ExerciseRegime.objects.filter(name=name).filter(text=text)
        self.assertTrue(created_regime.exists())
        self.assertEqual(len(created_regime), 1)
        created_regime = created_regime[0]
        self.assertEqual(created_regime.poster, poster)
        self.assertEqual(created_regime.text, text)
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
        self.assertEqual(content["text"], exercise_regime.text)
        self.assertEqual(content["times_completed"], exercise_regime.times_completed)
        self.assertEqual(content["poster"], exercise_regime.poster)
        self.assertEqual(content["likers"], list(exercise_regime.likers.all()))
        self.assertEqual(content["exercises"], list(exercise_regime.exercises.all()))
    