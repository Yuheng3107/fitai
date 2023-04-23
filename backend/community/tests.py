from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from model_bakery import baker
# API TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import json

from .models import Community, CommunityMembers

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

class CommunityCreateViewTests(APITestCase):
    def test_create_community(self):
        url = reverse('create_community')
        user = baker.make('users.AppUser')
        content = 'Lorem Ipsum blablabla'
        name = 'Test Community'
        privacy_level = 1
        data = {
            'name': name,
            'description': content,
            'privacy_level': privacy_level,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        # Check that community creates once user is autheticated
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        community = Community.objects.get()
        self.assertEqual(community.name, name)
        self.assertEqual(community.description, content)
        self.assertEqual(community.created_by, user)
        self.assertEqual(community.privacy_level, privacy_level)
        cm  = CommunityMembers.objects.get()
        self.assertEqual(cm.moderator_level, 3)

class CommunityUpdateViewTests(APITestCase):
    def test_update_community(self):
        url = reverse('update_community')
        user = baker.make('users.AppUser')
        community = baker.make(Community)
        user.communities.add(community)
        content = 'Lorem Ipsum blablabla'
        name = 'Test Community'
        privacy_level = 1
        data = {
            'id': community.id,
            'name': name,
            'description': content,
            'privacy_level': privacy_level,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        member = CommunityMembers.objects.get(user=user.id, community=community.id)
        member.moderator_level = 2
        member.save()
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        community = Community.objects.get()
        self.assertEqual(community.name, name)
        self.assertEqual(community.description, content)
        self.assertEqual(community.privacy_level, privacy_level)

        data = {
            'name': name,
            'description': content,
            'privacy_level': privacy_level,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class CommunityDetailViewTests(APITestCase):
    def test_community_detail(self):
        community = baker.make(Community)
        
        url = reverse('community_detail', kwargs={"pk": community.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data["name"], community.name)
        self.assertEqual(data["description"], community.description)
        self.assertEqual(data["created_by"], community.created_by)
        url = reverse('community_detail', kwargs={"pk": 69})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CommunityListViewTests(APITestCase):
    def test_community_list(self):
        """test the list method"""
        url = reverse('community_list')
        post_no = 2
        communities = [baker.make(Community) for i in range(post_no)]
        data = {
            "communities": [community.id for community in communities]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        for i, community in enumerate(communities):
            self.assertEqual(data[i]["name"], community.name)
            self.assertEqual(data[i]["description"], community.description)
            self.assertEqual(data[i]["created_by"], community.created_by)
    
class CommunityDeleteViewTests(APITestCase):
    def test_delete_community(self):
        user = baker.make('users.AppUser')
        community = baker.make(Community, created_by=user)
        url = reverse('delete_community', kwargs={"pk": community.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        user.communities.add(community)
        member = CommunityMembers.objects.get(user=user.id, community=community.id)
        member.moderator_level = 3
        member.save()
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(Community.DoesNotExist):
            Community.objects.get(pk=community.id)

class CommunityMembersUpdateViewTests(APITestCase):
    def test_update_community_members(self):
        user = baker.make('users.AppUser')
        user2 = baker.make('users.AppUser')
        community = baker.make(Community, created_by=user)
        data = {
            'user_id': user2.id,
            'community_id': community.id,
            'moderator_level': 69,
        }
        url = reverse('update_community_members')
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response.client.force_authenticate(user=user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        user.communities.add(community)
        member = CommunityMembers.objects.get(user=user.id, community=community.id)
        member.moderator_level = 3
        member.save()
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user2.communities.add(community)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = {
            'user_id': user2.id,
            'community_id': community.id,
            'moderator_level': 2,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        member = CommunityMembers.objects.get(user=user2.id, community=community.id)
        self.assertEqual(member.moderator_level, 2)
        
class CommunityUpdatePhotoViewTest(APITestCase):
    def test_upload_photo(self):
        url = reverse('update_community_photo')
        
        user = baker.make('users.AppUser')
        community = baker.make(Community)
        user.communities.add(community)
        cm = CommunityMembers.objects.get()
        cm.moderator_level = 3
        cm.save()
        data = {'id': community.id, "photo": SimpleUploadedFile('test.mp4', b'test', content_type='text/plain')}
        # Need to have multipart format to enable file uploads
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data, format="multipart")
        # USED TO BE CHECK FOR WRONG FILETYPE
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Clean the static media directory
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.jpg'):
                os.remove(os.path.join(dir_path, file))

class CommunityUpdateBannerViewTest(APITestCase):
    def test_upload_photo(self):
        url = reverse('update_community_banner')
        
        user = baker.make('users.AppUser')
        community = baker.make(Community)
        user.communities.add(community)
        cm = CommunityMembers.objects.get()
        cm.moderator_level = 3
        cm.save()
        data = {'id': community.id, "photo": SimpleUploadedFile('test.mp4', b'test', content_type='text/plain')}
        # Need to have multipart format to enable file uploads
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data, format="multipart")
        # USED TO BE CHECK FOR WRONG FILETYPE
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Clean the static media directory
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.jpg'):
                os.remove(os.path.join(dir_path, file))

class CommunitySearchViewTest(APITestCase):
    def test_search_community(self):
        url = reverse('search_community')
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data["content"] = "gay ass"
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        squat_community = baker.make(Community, name="Squats", description="Thunder thighs only", member_count=100)
        calisthenics_community = baker.make(Community, name="Calisthenics", description="Exercises like squats or push-ups", member_count=1000)
        data["content"] = "squat"
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data[0]["name"], calisthenics_community.name)
        self.assertEqual(response_data[0]["description"], calisthenics_community.description)
        self.assertEqual(response_data[1]["name"], squat_community.name)
        self.assertEqual(response_data[1]["description"], squat_community.description)
        data["content"] = "thigh"
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data[0]["name"], squat_community.name)
        self.assertEqual(response_data[0]["description"], squat_community.description)
        data["content"] = "calisthen"
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data[0]["name"], calisthenics_community.name)
        self.assertEqual(response_data[0]["description"], calisthenics_community.description)
        
        
