from django.core.files.uploadedfile import SimpleUploadedFile
import os
from model_bakery import baker
from .models import Achievement
from django.test import TestCase

# Create your tests here.
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
        """Test Read Operation"""
        achievement.save()
        database_achievement = Achievement.objects.get(name="Test Achievement")
        self.assertEqual(database_achievement.name, "Test Achievement")
        self.assertEqual(database_achievement.description,
                         "A test achievement.")
        self.assertIsNotNone(database_achievement.image)
        self.assertEqual(database_achievement.image.name, image.name)

        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_update_achievement(self):
        achievement = baker.make(Achievement)
        updated_description = "New Description"
        achievement.description = updated_description
        achievement.save()
        new_achievement = Achievement.objects.get(pk=achievement.id)
        self.assertEqual(new_achievement.description, updated_description)

    def test_delete_achievement(self):
        achievement = baker.make(Achievement)
        Achievement.objects.get(pk=achievement.id).delete()
        with self.assertRaises(Achievement.DoesNotExist):
            Achievement.objects.get(pk=achievement.id)

