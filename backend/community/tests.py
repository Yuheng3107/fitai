from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from model_bakery import baker
from .models import Community

# Create your tests here.

class CommunityTestCase(TestCase):
    def test_create_community(self):
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
        name = 'Test Community'
        privacy_level = 1
        community = baker.make(
            Community,
            name = name,
            description = content,
            banner = media,
            created_by = user,
            privacy_level = privacy_level,
        )

        community = Community.objects.get()
        self.assertEqual(community.name, name)
        self.assertEqual(community.description, content)
        self.assertEqual(community.banner.name, media.name)
        self.assertEqual(community.created_by, user)
        self.assertEqual(community.privacy_level, privacy_level)
        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_delete_community(self):
        """Test that Community can be deleted properly"""
        community = baker.make(Community)
        Community.objects.get(pk=community.id).delete()
        with self.assertRaises(Community.DoesNotExist):
            Community.objects.get(pk=community.id)

    def test_delete_founder(self):
        """To test whether community is not deleted after founder is deleted"""
        User = get_user_model()
        user = baker.make(User)
        community = baker.make(Community,created_by=user)
        self.assertIsInstance(community, Community)
        community_id = community.id
        User.objects.get(pk=user.id).delete()
        updated_community =  Community.objects.get(pk=community.id)
        self.assertEqual(updated_community.id, community_id)
        self.assertEqual(updated_community.created_by, None)

    def test_update_community(self):
        """Test that Community can be updated"""
        community = baker.make(Community)
        updated_content = "New Description Content"
        community.description = updated_content
        community.save()
        updated_community = Community.objects.get(pk=community.id)
        self.assertEqual(updated_community.description, updated_content)
