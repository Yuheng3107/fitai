from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
import os
<<<<<<< HEAD
from model_bakery import baker

=======
from model_mommy import mommy
from rest_framework.test import APITestCase
>>>>>>> 5cde7d06ad880b2342cade8e219db673961fa7b4
# Create your tests here.
class UsersManagersTests(TestCase):
    def setUp(self):
        self.User = get_user_model()

    def test_create_user(self):
        user = self.User.objects.create_user(
            email='test@user.com',first_name="Test", last_name="Person", username="test_username",
        )
        self.assertEqual(user.email, "test@user.com")
        self.assertEqual(user.first_name, "Test")
        self.assertEqual(user.last_name, "Person")
        self.assertEqual(user.username, "test_username")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

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
        