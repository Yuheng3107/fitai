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
import json
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from .serializer import UserSerializer
# Create your tests here.
User = get_user_model()
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
        user.following.add(fren)

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
        
        for x in user.following.all():
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
        user.followers.add(fren)
        fren2 = baker.make(self.User)
        user.followers.add(fren2)

        # test for 2 frens and achievements
        i = 0
        for x in user.achievements.all():
            i += 1
        self.assertEqual(i,2)
        i = 0
        for x in user.followers.all():
            i += 1
        self.assertEqual(i,2)

        user.followers.remove(fren)
        user.achievements.remove(achievement)

        # test for only 1 fren and achievement
        for x in user.achievements.all():
            self.assertEqual(x,achievement2)
        for x in user.followers.all():
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
            "email": "testuser@gmail.com",
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
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("email", None), email)

class UserOtherDetailViewTests(APITestCase):
    def test_retrieve_other_user_data(self):
        "Ensure we can retrieve other users from db"
        
        User = get_user_model()
        email = "testuser@gmail.com"
        user = User.objects.create_user(email=email)
        url = reverse('other_user_detail', kwargs={"pk": user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("email", None), email)
        
class UserManyToManyUpdateViewTests(APITestCase):
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
        # Ensures friends are successfully added
        self.assertEqual(list(user.achievements.all()), achievements)
        
class UserManyToManyDeleteViewTests(APITestCase):
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
        
class UserAllowedViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('user_allowed')
    def test_username_and_email_no_duplicates_allowed(self):
        user = baker.make('users.AppUser')
        data = {
            "username": user.username
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.content)
        data = {
            "username": user.username,
            "email": user.email
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(json.loads(response.content))
        data = {
            "username": "testname",
            "email": user.email
        }
        
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(json.loads(response.content))
        data = {
            "username": user.username,
            "email": "test"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(json.loads(response.content))
        data = {
            "username": "testuser",
            "email": "testemail"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(json.loads(response.content))
        
class UserUpdateViewTests(APITestCase):
    def test_update_user_normal_fields(self):
        User = get_user_model()
        user = baker.make(User)
        url = reverse('update_user')
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        updated_username = "Updated Username"
        updated_privacy_level = 1
        updated_email = "test@testuser.com"
        updated_bio = "IM SUPER GAY"
        data = {
            "username": updated_username,
            "privacy_level": updated_privacy_level,
            "email": updated_email,
            "bio": updated_bio
        }
        response = self.client.post(url, data)
        user = User.objects.get(pk=user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.username, updated_username)
        self.assertEqual(user.privacy_level, updated_privacy_level)
        self.assertEqual(user.email, updated_email)
        self.assertEqual(user.bio, updated_bio)
        
class UserUpdateProfilePhotoViewTest(APITestCase):
    def test_upload_photo(self):
        url = reverse('update_user_profile_photo')
        data = {"photo": SimpleUploadedFile('test.mp4', b'test', content_type='text/plain')}
        user = baker.make('users.AppUser')
        # Need to have multipart format to enable file uploads
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data, format="multipart")
        # USED TO BE CHECK FOR WRONG FILETYPE
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with open(os.path.join(os.getcwd(), "users/2MB_Text.txt"), "rb") as f:
            long_text_of_2MB_size = f.read()
        
        data = {"photo": SimpleUploadedFile('test.jpg', long_text_of_2MB_size, content_type='text/plain')}
        # Test that file of 2MB or more does not work
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {"photo": SimpleUploadedFile('test.jpg', b"test", content_type='text/plain')}
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Clean the static media directory
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.jpg'):
                os.remove(os.path.join(dir_path, file))

class UserFollowingListView(APITestCase):
    def test_get_user_following_list(self):
        """Gets whole list of user following"""
        User = get_user_model()
        user = baker.make(User)
        following = [baker.make(User) for i in range(3)]
        user.following.add(*following)
        # Check that followers were added
        self.assertEqual(following, list(user.following.all()))
        url = reverse('user_following_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        following_data = UserSerializer(following, many=True).data
        self.assertEqual(data, following_data)
        
class UserFollowerListView(APITestCase):
    def test_get_user_follower_list(self):
        """Gets whole list of user's followers"""
        User = get_user_model()
        user = baker.make(User)
        followers = [baker.make(User) for i in range(3)]
        for follower in followers:
            # Get followers to follow the user
            follower.following.add(user)
        # Check that followers were added
        self.assertEqual(followers, list(user.followers.all()))
        
        url = reverse('user_followers_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        follower_data = UserSerializer(followers, many=True).data
        self.assertEqual(data, follower_data)

class UserStreakUpdateViewTests(APITestCase):
    def test_update_user_streak(self):
        url = reverse('update_user_streak')
        # Check that login is required
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        User = get_user_model()
        user = baker.make(User, active=False, streak=68, longest_streak=68)
        old_streak = user.streak
        old_longest_streak = user.longest_streak
        self.client.force_authenticate(user=user)
        self.assertFalse(user.active)
        # Test that streak updates when user is inactive
        response = self.client.get(url)
        
        self.assertTrue(user.active)
        new_streak = user.streak
        new_longest_streak = user.longest_streak
        self.assertEqual(new_streak, old_streak+1)
        self.assertEqual(new_longest_streak, old_longest_streak+1)
        # Test that streak doesn't update when user is already active
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(user.streak, new_streak)
        self.assertEqual(user.longest_streak, new_longest_streak)
        self.assertTrue(user.active)

class UserFriendRequestUpdateViewTests(APITestCase):
    def test_update_user_friend_requests(self):
        url = reverse('update_user_friend_requests')
        friend = baker.make('users.AppUser')
        data = {
            "user_id": friend.id
        }
        user = baker.make('users.AppUser')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        user.following.add(friend)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        user.following.remove(friend)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensures friends are successfully added
        self.assertEqual(user.sent_friend_requests.all()[0], friend)

class UserFriendRequestAcceptViewTests(APITestCase):
    def test_accept_user_friend_requests(self):
        url = reverse('accept_user_friend_requests')
        friend = baker.make('users.AppUser')
        user = baker.make('users.AppUser')
        data = {
            "user_id": friend.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Ensures friends are successfully added
        friend.sent_friend_requests.add(user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.followers.all()[0],friend)
        self.assertEqual(friend.followers.all()[0],user)
        self.assertEqual(friend.sent_friend_requests.exists(), False)

class UserFriendDeleteViewTests(APITestCase):
    def test_delete_user_friend(self):
        friend = baker.make('users.AppUser')
        user = baker.make('users.AppUser')
        user.followers.add(friend)
        user.following.add(friend)
        url = reverse('delete_user_friend', kwargs={"pk": friend.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.followers.exists(), False)
        self.assertEqual(friend.followers.exists(), False)

class UserFriendRequestDeclineViewTests(APITestCase):
    def test_accept_user_friend_requests(self):
        url = reverse('decline_user_friend_requests')
        friend = baker.make('users.AppUser')
        user = baker.make('users.AppUser')
        data = {
            "user_id": friend.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Ensures friends are successfully added
        friend.sent_friend_requests.add(user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.followers.exists(), False)
        self.assertEqual(friend.followers.exists(), False)
        self.assertEqual(friend.sent_friend_requests.exists(), False)

class UserSearchViewTests(APITestCase):
    def test_search_users(self):
        url = reverse('search_users')
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data["content"] = ""
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        followers = baker.make(User, _quantity=10)
        user_a = baker.make(User, username='user_a', followers=followers)
        user_b = baker.make(User, username='user_b')
        data["content"] = "user"
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data[0]["username"], user_a.username)
        self.assertEqual(response_data[1]["username"], user_b.username)
        
        
class OtherUserListViewTests(APITestCase):
    def test_other_user_list(self):
        """test the list method"""
        url = reverse('other_user_list')
        User = get_user_model()
        user_no = 2
        users = [baker.make(User) for i in range(user_no)]
        data = {
            "user_ids": [post.id for post in users]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        for i, user in enumerate(users):
            self.assertEquals(user.id, data[i]["id"])
            self.assertEquals(user.email, data[i]["email"])
            self.assertEquals(user.username, data[i]["username"])
        
class UserCommunityUpdateViewTests(APITestCase):
    def test_community_member_count_increase(self):
        url = reverse('update_user_communities')
        community = baker.make(Community, member_count=68)
        user = baker.make(User)
        self.client.force_authenticate(user=user)
        data = {
            "fk_list": [community.id]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Get the most updated instance of community
        community = Community.objects.get(pk=community.id)
        self.assertEqual(community.member_count, 69)

class UserCommunityDeleteViewTests(APITestCase):
    def test_community_member_count_decrease(self):
        
        community = baker.make(Community, member_count=70)
        user = baker.make(User, communities=[community], make_m2m=True)
        self.client.force_authenticate(user=user)
        url = reverse('delete_user_communities', kwargs={"pk": community.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Get the most updated instance of community
        community = Community.objects.get(pk=community.id)
        self.assertEqual(community.member_count, 69)