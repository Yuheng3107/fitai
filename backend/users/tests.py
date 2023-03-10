from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
import os
from model_bakery import baker
from rest_framework.test import APITestCase

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

    def test_delete_user(self):
        user = baker.make(self.User)
        self.User.objects.get(pk=user.id).delete()
        with self.assertRaises(self.User.DoesNotExist):
            self.User.objects.get(pk=user.id)

class LoginDataViewTests(APITestCase):
    def test_create_user(self):
        """Ensure we can create a new user"""
        url = reverse('login_data')
        data = {
            "first_name": "User",
            "last_name": "Test",
            "email": "testuser@gmail.com"
        }
        response = self.client.post(url, data, format='json')
        User = get_user_model()
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get(first_name="User").email, data["email"])
        
    def test_retrieve_user(self):
        "Ensure we can retrieve user from db"
        url = reverse('login_data')
        User = get_user_model()
        email = "testuser@gmail.com"
        user = User.objects.create_user(email=email)
        self.client.force_authenticate(user=user)
        response = self.client.get(url, format='json')
        self.assertEqual(response.data.get("email", None), email)
        