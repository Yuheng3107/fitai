from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Achievement
from django.core.files.uploadedfile import SimpleUploadedFile
import os


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
    def test_create_achievement(self):
        """Creates a gif in memory to act as a file for testing purposes"""
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        image = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        achievement = Achievement.objects.create(
            name="Test Achievement", image=image, description="A test achievement.")
        self.assertEqual(achievement.name, "Test Achievement")
        self.assertEqual(achievement.description, "A test achievement.")
        self.assertIsNotNone(achievement.image)
        self.assertEqual(achievement.image.name, image.name)
        achievement.save()
        database_achievement = Achievement.objects.get(name="Test Achievement")
        self.assertEqual(database_achievement.name, "Test Achievement")
        self.assertEqual(database_achievement.description,
                         "A test achievement.")
        self.assertIsNotNone(database_achievement.image)
        self.assertEqual(database_achievement.image.name, image.name)

        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))
