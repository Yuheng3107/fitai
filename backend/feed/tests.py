from cgitb import text
from django.test import TestCase
import os
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.contenttypes.models import ContentType
from model_bakery import baker

from .models import UserPost, CommunityPost, Comment
# Create your tests here.


class UserPostTestCase(TestCase):
    def set_up(self):
        self.User = get_user_model()


    def test_create_user_post(self):
        user = baker.make('users.User')
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        content = "Test User_Post Content"
        # likes = 69
        image = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        post = UserPost.objects.create(
            poster=user, text=content, image=image)
        self.assertEqual(post.poster, user)
        # self.assertEqual(post.likes, likes)
        self.assertEqual(post.text, content)
        self.assertEqual(post.image.name, image.name)
        post.save()
        """Test whether UserPost can be retrieved and whether fields are the same"""
        saved_user_post = UserPost.objects.get()
        self.assertEqual(saved_user_post.poster, user)
        # self.assertEqual(saved_user_post.likes, likes)
        self.assertEqual(saved_user_post.text, content)
        self.assertEqual(saved_user_post.image.name, image.name)
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
        post = baker.make(UserPost)
        # Check that UserPost was created
        self.assertIsInstance(post, UserPost)
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        content = "Test UserPost Comment Content"
        ct = ContentType.objects.get_for_model(UserPost)
        comment = post.comments.objects.create(
            text=content, poster=user)
        self.assertEqual(comment.text, content)
        self.assertEqual(comment.poster, user)
        self.assertEqual(comment.parent_type, ct)
        self.assertEqual(comment.parent_id, post.id)

    def test_delete_commenter(self):
        """To test whether comment is deleted after commenter is deleted"""
        user = baker.make(self.User)
        comment = baker.make(Comment, commenter=user)
        self.assertIsInstance(comment, Comment)
        self.User.objects.get(pk=user.id).delete()
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
        post = baker.make(CommunityPost)
        self.assertIsInstance(post, CommunityPost)
    
    def test_read_community_post(self):
        post = baker.make(CommunityPost)
        content = post.text 
        # likes = post.likes 
        read_post = CommunityPost.objects.get(pk=post.id)
        self.assertEqual(content, read_post.text)
        # self.assertEqual(likes, read_post.likes)
        
    def test_update_community_post(self):
        post = baker.make(CommunityPost)
        updated_content = "Updated Content"
        # updated_likes = 69
        post.text = updated_content
        # post.likes = updated_likes
        post.save()
        updated_post = CommunityPost.objects.get(pk=post.id)
        self.assertEqual(updated_post.text, updated_content)
        # self.assertEqual(updated_post.likes, updated_likes)
        
    def test_delete_community_post(self):
        post = baker.make(CommunityPost)
        CommunityPost.objects.get(pk=post.id).delete()
        with self.assertRaises(CommunityPost.DoesNotExist):
            CommunityPost.objects.get(pk=post.id)
            

class CommunityPostCommentTestCase(TestCase):
    def test_create_community_post_comment(self):
        post = baker.make(CommunityPost)

        ct = ContentType.objects.get_for_model(CommunityPost)
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        content = "Test CommunityPost Comment Content"
        comment = post.comment.create(poster=user, text=content)
        self.assertIsInstance(comment, Comment)
        self.assertEqual(comment.text, content)
        self.assertEqual(comment.poster, user)
        self.assertEqual(comment.parent_type, ct)
        self.assertEqual(comment.parent_id, post.id)
    
            