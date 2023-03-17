from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
import os
from model_bakery import baker
from rest_framework.test import APITestCase
from achievements.models import Achievement # type: ignore
from community.models import Community #type: ignore
from exercises.models import Exercise, ExerciseRegime #type: ignore
from chat.models import ChatGroup #type: ignore
from rest_framework.views import status
# Create your tests here.
class UsersManagersTests(TestCase):
    def setUp(self):
        self.User = get_user_model()

    def test_create_user(self):
        privacy_level = 1
        user = self.User.objects.create_user(
            email='test@user.com',first_name="Test", last_name="Person", username="test_username", privacy_level=privacy_level
        )
        community = baker.make('community.community')
        user.communities.add(community)
        exercise = baker.make('exercises.exercise')
        user.exercises.add(exercise)
        chat_group = baker.make('chat.chatgroup')
        user.chat_groups.add(chat_group)
        achievement = baker.make('achievements.achievement')
        user.achievements.add(achievement) 
        fren = baker.make(self.User)
        user.friends.add(fren)

        user = self.User.objects.get(first_name='Test')
        self.assertEqual(user.email, "test@user.com")
        self.assertEqual(user.first_name, "Test")
        self.assertEqual(user.last_name, "Person")
        self.assertEqual(user.username, "test_username")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.privacy_level, privacy_level)

        # many to many checks
        for x in user.communities.all():
            self.assertEqual(x,community)
        
        for x in user.exercises.all():
            self.assertEqual(x,exercise)

        for x in user.chat_groups.all():
            self.assertEqual(x,chat_group)

        for x in user.achievements.all():
            self.assertEqual(x,achievement)
        
        for x in user.friends.all():
            self.assertEqual(x,fren)
        
        # test for no data
        with self.assertRaises(TypeError):
            self.User.objects.create_user()
        # test for no email
        with self.assertRaises(ValueError):
            self.User.objects.create_user(email="")

    def test_create_super_user(self):
        admin_user = self.User.objects.create_superuser(
            email="test@superuser.com", password="Password")
        self.assertEqual(admin_user.email, "test@superuser.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        try:
            self.assertEqual(admin_user.username, "")
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            self.User.objects.create_superuser(
                email="test@superuser.com", password="Password", is_superuser=False)

    def test_update_user(self):
        user = baker.make(self.User)
        updated_username = "newusername"
        user.username = updated_username
        user.save()
        updated_user = self.User.objects.get(pk=user.id)
        self.assertEqual(updated_user.username, updated_username)

    def test_multiple_m2m_user(self):
        user = baker.make(self.User)
        achievement = baker.make('achievements.achievement')
        user.achievements.add(achievement) 
        achievement2 = baker.make('achievements.achievement')
        user.achievements.add(achievement2) 
        fren = baker.make(self.User)
        user.friends.add(fren)
        fren2 = baker.make(self.User)
        user.friends.add(fren2)

        # test for 2 frens and achievements
        i = 0
        for x in user.achievements.all():
            i += 1
        self.assertEqual(i,2)
        i = 0
        for x in user.friends.all():
            i += 1
        self.assertEqual(i,2)

        user.friends.remove(fren)
        user.achievements.remove(achievement)

        # test for only 1 fren and achievement
        for x in user.achievements.all():
            self.assertEqual(x,achievement2)
        for x in user.friends.all():
            self.assertEqual(x,fren2)

    def test_delete_user(self):
        user = baker.make(self.User)
        self.User.objects.get(pk=user.id).delete()
        with self.assertRaises(self.User.DoesNotExist):
            self.User.objects.get(pk=user.id)

class UserCreateViewTests(APITestCase):
    def test_create_user(self):
        """Ensure we can create a new user"""
        url = reverse('create_user')
        data = {
            "first_name": "User",
            "last_name": "Test",
            "email": "testuser@gmail.com"
        }
        response = self.client.post(url, data)
        User = get_user_model()
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get(first_name="User").email, data["email"])
        

class UserDetailViewTests(APITestCase):
      
    def test_retrieve_user_data(self):
        "Ensure we can retrieve user from db"
        url = reverse('user_detail')
        User = get_user_model()
        email = "testuser@gmail.com"
        user = User.objects.create_user(email=email)
        self.client.force_authenticate(user=user)
        response = self.client.get(url, format='json')
        self.assertEqual(response.data.get("email", None), email)

class UserAchievementsUpdateViewTests(APITestCase):
    def test_update_user_achievements(self):
        url = reverse('update_user_achievements')
        achievements = [baker.make(Achievement) for i in range(3)]
        data = {
            "fk_list": [achievement.id for achievement in achievements]
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures achievements are successfully added
        self.assertEqual(list(user.achievements.all()), achievements)
        
class UserFriendsUpdateViewTests(APITestCase):
    def test_update_user_friends(self):
        url = reverse('update_user_friends')
        friends = [baker.make('users.AppUser') for i in range(3)]
        data = {
            "fk_list": [friend.id for friend in friends]
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures friends are successfully added
        self.assertEqual(list(user.friends.all()), friends)
        
class UserCommunitiesUpdateViewTests(APITestCase):
    def test_update_user_communities(self):
        url = reverse('update_user_communities')
        communities = [baker.make(Community) for i in range(3)]
        data = {
            "fk_list": [community.id for community in communities]
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures communities are successfully added
        self.assertEqual(list(user.communities.all()), communities)

class UserExercisesUpdateViewTests(APITestCase):
    def test_update_user_exercises(self):
        url = reverse('update_user_exercises')
        exercises = [baker.make(Exercise) for i in range(3)]
        data = {
            "fk_list": [exercise.id for exercise in exercises]
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures exercises are successfully added
        self.assertEqual(list(user.exercises.all()), exercises)
        
class UserExerciseRegimesUpdateViewTests(APITestCase):
    def test_update_user_exercise_regimes(self):
        url = reverse('update_user_exercise_regimes')
        exercise_regimes = [baker.make(ExerciseRegime) for i in range(3)]
        data = {
            "fk_list": [exercise_regime.id for exercise_regime in exercise_regimes]
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures exercise_regimes are successfully added
        self.assertEqual(list(user.exercise_regimes.all()), exercise_regimes)

class UserChatGroupsUpdateViewTests(APITestCase):
    def test_update_user_chat_groups(self):
        url = reverse('update_user_chat_groups')
        chat_groups = [baker.make(ChatGroup) for i in range(3)]
        data = {
            "fk_list": [chat_group.id for chat_group in chat_groups]
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures chat_groups are successfully added
        self.assertEqual(list(user.chat_groups.all()), chat_groups)
        
class UserAchievementsDeleteViewTests(APITestCase):
    def test_delete_user_achievements(self):
        achievement = baker.make(Achievement)
        url = reverse('delete_user_achievements', kwargs={"pk": achievement.id})
        user = baker.make('users.AppUser')
        user.achievements.add(achievement.id)
        # Check that user has been added
        self.assertTrue(user.achievements.all().exists())
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures achievements are successfully deleted
        self.assertFalse(user.achievements.all().exists())
        
class UserFriendsDeleteViewTests(APITestCase):
    def test_delete_user_friends(self):
        friend = baker.make('users.AppUser')
        url = reverse('delete_user_friends', kwargs={"pk": friend.id})
        user = baker.make('users.AppUser')
        user.friends.add(friend.id)
        # Check that user has been added
        self.assertTrue(user.friends.all().exists())
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures friends are successfully deleted
        self.assertFalse(user.friends.all().exists())
        
class UserCommunitiesDeleteViewTests(APITestCase):
    def test_delete_user_communities(self):
        community = baker.make(Community)
        url = reverse('delete_user_communities', kwargs={"pk": community.id})
        user = baker.make('users.AppUser')
        user.communities.add(community.id)
        # Check that user has been added
        self.assertTrue(user.communities.all().exists())
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures communities are successfully deleted
        self.assertFalse(user.communities.all().exists())

class UserExercisesDeleteViewTests(APITestCase):
    def test_delete_user_exercises(self):
        exercise = baker.make(Exercise)
        url = reverse('delete_user_exercises', kwargs={"pk": exercise.id})
        user = baker.make('users.AppUser')
        user.exercises.add(exercise.id)
        # Check that user has been added
        self.assertTrue(user.exercises.all().exists())
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures exercises are successfully deleted
        self.assertFalse(user.exercises.all().exists())
        
class UserExerciseRegimesDeleteViewTests(APITestCase):
    def test_delete_user_exercise_regimes(self):
        exercise_regime = baker.make(ExerciseRegime)
        url = reverse('delete_user_exercise_regimes', kwargs={"pk": exercise_regime.id})
        user = baker.make('users.AppUser')
        user.exercise_regimes.add(exercise_regime.id)
        # Check that user has been added
        self.assertTrue(user.exercise_regimes.all().exists())
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures exercise_regimes are successfully deleted
        self.assertFalse(user.exercise_regimes.all().exists())
        
class UserChatGroupsDeleteViewTests(APITestCase):
    def test_delete_user_chat_groups(self):
        chat_group = baker.make(ChatGroup)
        url = reverse('delete_user_chat_groups', kwargs={"pk": chat_group.id})
        user = baker.make('users.AppUser')
        user.chat_groups.add(chat_group.id)
        # Check that user has been added
        self.assertTrue(user.chat_groups.all().exists())
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures chat_groups are successfully deleted
        self.assertFalse(user.chat_groups.all().exists())