from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Achievement
import unittest.mock as mock
from django.core.files import File


class UsersManagersTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="test@user.com", first_name="Test", last_name="Person", username="test_username")
        self.assertEqual(user.email, "test@user.com")
        self.assertEqual(user.first_name, "Test")
        self.assertEqual(user.last_name, "Person")
        self.assertEqual(user.username, "test_username")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(ValueError):
            User.objects.create_user(email="")

    def test_create_super_user(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(
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
            User.objects.create_superuser(
                email="test@superuser.com", password="Password", is_superuser=False)


class AchievementsTest(TestCase):
    def create_achievement(self):
        mock_file = mock.MagicMock(spec=File, name='test.jpg')
        achievement = Achievement.objects.create(
            name="Test Achievement", image=mock_file, description="A test achievement.")
        self.assertEqual(achievement.name, "Test Achievement")
        self.assertEqual(achievement.description, "A test achievement.")
        self.assertEqual(achievement.image, mock_file)
