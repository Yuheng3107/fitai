# TestCase
from django.test import TestCase
from django.contrib.auth import get_user_model
from model_bakery import baker
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from django.contrib.contenttypes.models import ContentType
# API TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import json

from .models import UserPost, CommunityPost, Comment, Tags
from exercises.models import Exercise
# Create your tests here.


class UserPostTestCase(TestCase):
    def test_create_user_post(self):
        User = get_user_model()
        user = baker.make(User)
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        content = "Test User_Post Content"
        media = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        user_post = UserPost.objects.create(
            poster=user, text=content, media=media, likes=1)
        tags = baker.make(Tags, tag='Gay')
        user_post.tags.add(tags)
        lover = baker.make(User)
        user_post.likers.add(lover)

        saved_user_post = UserPost.objects.get()
        self.assertEqual(saved_user_post.poster, user)
        self.assertEqual(saved_user_post.likes, 1)
        self.assertEqual(saved_user_post.text, content)
        self.assertEqual(saved_user_post.media.name, media.name)
        # many to many check
        for x in saved_user_post.tags.all():
            self.assertEqual(x,tags)

        # many to many checks
        for x in saved_user_post.tags.all():
            self.assertEqual(x,tags)
        for x in saved_user_post.likers.all():
            self.assertEqual(x,lover)

        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_delete_user_post(self):
        """Test that UserPost can be deleted properly"""
        post = baker.make(UserPost)
        UserPost.objects.get(pk=post.id).delete()
        with self.assertRaises(UserPost.DoesNotExist):
            UserPost.objects.get(pk=post.id)
    
    def test_delete_poster(self):
        """To test whether post is not deleted after poster is deleted"""
        User = get_user_model()
        user = baker.make(User)
        post = baker.make(UserPost,poster=user)
        self.assertIsInstance(post, UserPost)
        post_id = post.id
        User.objects.get(pk=user.id).delete()
        updated_post =  UserPost.objects.get(pk=post.id)
        self.assertEqual(updated_post.id, post_id)
        self.assertEqual(updated_post.poster, None)

    def test_update_user_post(self):
        """Test that UserPost can be updated"""
        post = baker.make(UserPost)
        updated_content = "New Post Content"
        post.text = updated_content
        post.save()
        updated_post = UserPost.objects.get(pk=post.id)
        self.assertEqual(updated_post.text, updated_content)

class UserCommentTestCase(TestCase):
    User = get_user_model()

    def test_create_user_comment(self):
        User = get_user_model()
        post = baker.make(UserPost)
        # Check that UserPost was created
        self.assertIsInstance(post, UserPost)
        user = User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        content = "Test UserPost Comment Content"
        ct = ContentType.objects.get_for_model(UserPost)
        comment = post.comments.create(
            text=content, poster=user)
        self.assertEqual(comment.text, content)
        self.assertEqual(comment.poster, user)
        self.assertEqual(comment.parent_type, ct)
        self.assertEqual(comment.parent_id, post.id)

    def test_delete_commenter(self):
        """To test whether comment is not deleted after commenter is deleted"""
        User = get_user_model()
        user = baker.make(User)
        comment = baker.make(Comment, poster=user)
        self.assertIsInstance(comment, Comment)
        comment_id = comment.id
        User.objects.get(pk=user.id).delete()
        updated_comment =  Comment.objects.get(pk=comment.id)
        self.assertEqual(updated_comment.id, comment_id)
        self.assertEqual(updated_comment.poster, None)

    def test_delete_post_deletes_comment(self):
        """Test that deleting Post deletes its comments"""
        user = baker.make('users.AppUser')
        post = baker.make(UserPost)
        
        comment = post.comments.create(poster=user, text='content')
        self.assertIsInstance(comment, Comment)
        post.delete()
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(pk=comment.id)

    def test_delete_comment(self):
        """Test that we cannot retrieve comment once deleted"""
        comment = baker.make(Comment)
        Comment.objects.get(pk=comment.id).delete()
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(pk=comment.id)

    def test_update_comment(self):
        """Test that comment is updated"""
        comment = baker.make(Comment)
        updated_content = "Updated UserPostComment Content"
        comment.text = updated_content
        comment.save()
        new_comment = Comment.objects.get(pk=comment.id)
        self.assertEqual(new_comment.text, updated_content)

"""Write more test cases for Community Posts and Comments"""

class CommunityPostTestCase(TestCase):
    def test_create_community_post(self):
        community = baker.make('community.Community')
        post = baker.make(CommunityPost,community=community)
        self.assertIsInstance(post, CommunityPost)
    
    def test_delete_community_deletes_posts(self):
        """Test that deleting Community deletes its posts"""
        community = baker.make('community.Community')
        post = baker.make(CommunityPost,community=community)
        self.assertIsInstance(post, CommunityPost)
        community.delete()
        with self.assertRaises(CommunityPost.DoesNotExist):
            CommunityPost.objects.get(pk=post.id)
    
    def test_read_community_post(self):
        post = baker.make(CommunityPost)
        content = post.text 
        likes = post.likes 
        read_post = CommunityPost.objects.get(pk=post.id)
        self.assertEqual(content, read_post.text)
        self.assertEqual(likes, read_post.likes)
        
    def test_update_community_post(self):
        post = baker.make(CommunityPost)
        updated_content = "Updated Content"
        updated_likes = 2

        post.text = updated_content
        post.likes = updated_likes
        post.save()
        updated_post = CommunityPost.objects.get(pk=post.id)
        self.assertEqual(updated_post.text, updated_content)
        self.assertEqual(updated_post.likes, updated_likes)
        
    def test_delete_community_post(self):
        post = baker.make(CommunityPost)
        CommunityPost.objects.get(pk=post.id).delete()
        with self.assertRaises(CommunityPost.DoesNotExist):
            CommunityPost.objects.get(pk=post.id)
            

class CommunityPostCommentTestCase(TestCase):
    def test_create_community_post_comment(self):
        User = get_user_model()
        user = baker.make('users.AppUser')
        post = baker.make(CommunityPost, poster=user)
        
        user = User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        content = "Test CommunityPost Comment Content"
        comment = post.comments.create(poster=user, text=content)
        ct = ContentType.objects.get_for_model(CommunityPost)
        self.assertIsInstance(comment, Comment)
        self.assertEqual(comment.text, content)
        self.assertEqual(comment.poster, user)
        self.assertEqual(comment.parent_type, ct)
        self.assertEqual(comment.parent_id, post.id)


"""
API TestCasse
"""
class UserPostCreateViewTests(APITestCase):
    def test_create_user_post(self):
        """Ensure we can create user_post in UserPost Model"""
        url = reverse('create_user_post')
        User = get_user_model()
        post = baker.make(CommunityPost)
        user = User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        text = "Test UserPost Content"
        ct = ContentType.objects.get_for_model(CommunityPost)
        tags = []
        for i in range(3):
            tag = baker.make(Tags)
            tags.append(tag.tag)
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": post.id,
            "tags":  tags
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        # Check that user_post creates once user is autheticated
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user_post = UserPost.objects.get()
        self.assertEqual(user_post.text, text)
        self.assertEqual(user_post.shared_object, post)
        # Check no text
        data = {
            "shared_type": ct.id,
            "shared_id": post.id,
            "tags": tags
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check shared type
        data = {
            "text": text,
            "shared_type": 696969,
            "shared_id": post.id,
            "tags": tags
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # check shared id
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": 696969,
            "tags": tags
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserPostUpdateViewTests(APITestCase):
    def test_update_user_post(self):
        """Ensure we can update data in UserPost Model"""
        url = reverse('update_user_post')
        User = get_user_model()
        user = baker.make(User)
        user_post = baker.make(UserPost, poster=user)
        text = "actually im gay"
        data = {
            "id": user_post.id,
            "text": text
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # check that data cannot be accessed if wrong user
        user2 = baker.make(User)
        self.client.force_authenticate(user=user2)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Check that user_post edits once user is autheticated
        self.client.force_authenticate(user=user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserPost.objects.get(pk=user_post.id).text, text)
        # Test that view will return status code 400 when id is not in data
        data = {
            "text": text
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Test that view will return status code 404 when id is wrong
        data = {
            "id": 696969,
            "text": text
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class UserPostDetailViewTests(APITestCase):
    def test_user_post_detail(self):
        user = baker.make('users.AppUser')
        user_post = baker.make(UserPost)
        
        comment = user_post.comments.create(poster=user, text='content')
        url = reverse('user_post_detail', kwargs={"pk": user_post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data["likes"], user_post.likes)
        self.assertEqual(data["text"], user_post.text)
        self.assertEqual(data["poster"], user_post.poster)
        self.assertEqual(data["comments"][0], comment.id)
        url = reverse('user_post_detail', kwargs={"pk": 69})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class UserPostListViewTests(APITestCase):
    def test_user_post_list(self):
        """test the list method"""
        url = reverse('user_post_list')
        post_no = 2
        posts = [baker.make(UserPost) for i in range(post_no)]
        data = {
            "user_posts": [post.id for post in posts]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        for i, post in enumerate(posts):
            retrieved_post = data[i]
            self.assertEquals(post.id, retrieved_post["id"])
            self.assertEquals(post.text, retrieved_post["text"])
            self.assertEquals(post.poster, retrieved_post["poster"])
    
class UserPostDeleteViewTests(APITestCase):
    def test_delete_user_post(self):
        user = baker.make('users.AppUser')
        post = baker.make(UserPost, poster=user)
        url = reverse('delete_user_post', kwargs={"pk": post.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(UserPost.DoesNotExist):
            UserPost.objects.get(pk=post.id)


class CommentCreateViewTests(APITestCase):
    def test_create_comment(self):
        """Ensure we can create comment in Comment Model"""
        url = reverse('create_comment')
        User = get_user_model()
        post = baker.make(UserPost)
        user = User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        text = "Test UserPost Comment Content"
        ct = ContentType.objects.get_for_model(UserPost)
        data = {
            "text": text,
            "parent_type": ct.id,
            "parent_id": post.id
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        # Check that comment creates once user is autheticated
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        comment = Comment.objects.get()
        self.assertEqual(comment.text, text)
        self.assertEqual(comment.parent_object, post)
        # Check parent type
        data = {
            "text": text,
            "parent_type": 696969,
            "parent_id": post.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # check parent id
        data = {
            "text": text,
            "parent_type": ct.id,
            "parent_id": 696969
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class CommentUpdateViewTests(APITestCase):
    def test_update_comment(self):
        """Ensure we can update data in Comment Model"""
        url = reverse('update_comment')
        User = get_user_model()
        user = baker.make(User)
        comment = baker.make(Comment, poster=user)
        text = "actually im gay"
        data = {
            "id": comment.id,
            "text": text
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # check that data cannot be accessed if wrong user
        user2 = baker.make(User)
        self.client.force_authenticate(user=user2)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Check that comment edits once user is autheticated
        self.client.force_authenticate(user=user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Comment.objects.get(pk=comment.id).text, text)
        # Test that view will return status code 400 when id is not in data
        data = {
            "text": text
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Test that view will return status code 404 when id is wrong
        data = {
            "id": 696969,
            "text": text
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
class CommentDetailViewTests(APITestCase):
    def test_get_comment(self):
        comment = baker.make(Comment)
        url = reverse('comment_detail', kwargs={"pk": comment.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data["likes"], comment.likes)
        self.assertEqual(data["text"], comment.text)
        self.assertEqual(data["poster"], comment.poster)
        url = reverse('comment_detail', kwargs={"pk": 69})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CommentListViewTests(APITestCase):
    def test_comment_list(self):
        """test the list method"""
        url = reverse('comment_list')
        post_no = 2
        posts = [baker.make(Comment) for i in range(post_no)]
        data = {
            "comments": [post.id for post in posts]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        for i, post in enumerate(posts):
            retrieved_post = data[i]
            self.assertEquals(post.id, retrieved_post["id"])
            self.assertEquals(post.text, retrieved_post["text"])
            self.assertEquals(post.poster, retrieved_post["poster"])
    
class CommentDeleteViewTests(APITestCase):
    def test_delete_comment(self):
        user = baker.make('users.AppUser')
        post = baker.make(Comment, poster=user)
        url = reverse('delete_comment', kwargs={"pk": post.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(pk=post.id)
            
class CommunityPostCreateViewTests(APITestCase):
    def test_create_community_post(self):
        """Ensure we can create community_post in CommunityPost Model"""
        url = reverse('create_community_post')
        User = get_user_model()
        exercise = baker.make(Exercise)
        community = baker.make('community.Community')
        user = User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        text = "Test UserPost Content"
        ct = ContentType.objects.get_for_model(Exercise)
        tags = []
        for i in range(3):
            tag = baker.make(Tags)
            tags.append(tag.tag)
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": exercise.id,
            "tags":  tags,
            "community_id": community.id
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(user=user)
        # Check that community_post creates once user is autheticated
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        community_post = CommunityPost.objects.get()
        self.assertEqual(community_post.text, text)
        self.assertEqual(community_post.shared_object, exercise)
        # check no community
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": exercise.id,
            "tags": tags,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check shared type
        data = {
            "text": text,
            "shared_type": 696969,
            "shared_id": exercise.id,
            "tags": tags,
            "community_id": community.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # check shared id
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": 696969,
            "tags": tags,
            "community_id": community.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # check community id
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": exercise.id,
            "tags": tags,
            "community_id": 696969
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # check community id
        data = {
            "text": text,
            "shared_type": ct.id,
            "shared_id": exercise.id,
            "tags": ["imgay"],
            "community_id": 696969
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class CommunityPostUpdateViewTests(APITestCase):
    def test_update_community_post(self):
        """Ensure we can update data in CommunityPost Model"""
        url = reverse('update_community_post')
        User = get_user_model()
        user = baker.make(User)
        community_post = baker.make(CommunityPost, poster=user)
        text = "actually im gay"
        data = {
            "id": community_post.id,
            "text": text,
        }
        # Check that data cannot be accessed if you are not logged in
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # check that data cannot be accessed if wrong user
        user2 = baker.make(User)
        self.client.force_authenticate(user=user2)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Check that community_post edits once user is autheticated
        self.client.force_authenticate(user=user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CommunityPost.objects.get(pk=community_post.id).text, text)
        # Test that view will return status code 400 when id is not in data
        data = {
            "text": text
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Test that view will return status code 404 when id is wrong
        data = {
            "id": 696969,
            "text": text
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
class CommunityPostDetailTests(APITestCase):
    def test_get_community_post(self):
        community_post = baker.make(CommunityPost)
        user = baker.make('users.AppUser')
        
        comment = community_post.comments.create(poster=user, text='content')
        url = reverse('community_post_detail', kwargs={"pk": community_post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data["likes"], community_post.likes)
        self.assertEqual(data["text"], community_post.text)
        self.assertEqual(data["poster"], community_post.poster)
        self.assertEqual(data["comments"][0],comment.id)
        url = reverse('community_post_detail', kwargs={"pk": 69})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CommunityPostListViewTests(APITestCase):
    def test_community_post_list(self):
        """test the list method"""
        url = reverse('community_post_list')
        post_no = 2
        posts = [baker.make(CommunityPost) for i in range(post_no)]
        data = {
            "community_posts": [post.id for post in posts]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        for i, post in enumerate(posts):
            retrieved_post = data[i]
            self.assertEquals(post.id, retrieved_post["id"])
            self.assertEquals(post.text, retrieved_post["text"])
            self.assertEquals(post.poster, retrieved_post["poster"])
    
class CommunityPostDeleteViewTests(APITestCase):
    def test_delete_community_post(self):
        user = baker.make('users.AppUser')
        post = baker.make(CommunityPost, poster=user)
        url = reverse('delete_community_post', kwargs={"pk": post.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response.client.force_authenticate(user=user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(CommunityPost.DoesNotExist):
            CommunityPost.objects.get(pk=post.id)