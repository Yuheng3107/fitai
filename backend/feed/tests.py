from django.test import TestCase
import os
from .models import UserPost, UserPostComment, CommunityPostComment
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from model_mommy import mommy
# Create your tests here.


class UserPostTestCase(TestCase):
    User = get_user_model()

    def test_create_user_post(self):
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        content = "Test User_Post Content"
        likes = 69
        image = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        post = UserPost.objects.create(
            poster=user, likes=likes, content=content, image=image)
        self.assertEqual(post.poster, user)
        self.assertEqual(post.likes, likes)
        self.assertEqual(post.content, content)
        self.assertEqual(post.image.name, image.name)
        post.save()
        """Test whether UserPost can be retrieved and whether fields are the same"""
        saved_user_post = UserPost.objects.get()
        self.assertEqual(saved_user_post.poster, user)
        self.assertEqual(saved_user_post.likes, likes)
        self.assertEqual(saved_user_post.content, content)
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
        post = mommy.make(UserPost)
        UserPost.objects.get(pk=post.id).delete()
        with self.assertRaises(UserPost.DoesNotExist):
            UserPost.objects.get(pk=post.id)

    def test_update_user_post(self):
        """Test that UserPost can be updated"""
        post = mommy.make(UserPost)
        updated_content = "New Post Content"
        post.content = updated_content
        post.save()
        updated_post = UserPost.objects.get(pk=post.id)
        self.assertEqual(updated_post.content, updated_content)


class UserCommentTestCase(TestCase):
    User = get_user_model()

    def test_create_user_comment(self):
        post = mommy.make(UserPost)
        # Check that UserPost was created
        self.assertIsInstance(post, UserPost)
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        content = "Test UserPostComment Content"
        likes = 69
        comment = UserPostComment.objects.create(
            content=content, post=post, commenter=user, likes=likes)
        self.assertEqual(comment.content, content)
        self.assertEqual(comment.post, post)
        self.assertEqual(comment.commenter, user)
        self.assertEqual(comment.likes, likes)

    def test_delete_commenter(self):
        """To test whether comment is deleted after commenter is deleted"""
        user = mommy.make(self.User)
        comment = mommy.make(UserPostComment, commenter=user)
        self.assertIsInstance(comment, UserPostComment)
        self.User.objects.get(pk=user.id).delete()
        with self.assertRaises(UserPostComment.DoesNotExist):
            UserPostComment.objects.get(pk=comment.id)

    def test_delete_comment(self):
        """Test that we cannot retrieve comment once deleted"""
        comment = mommy.make(UserPostComment)
        UserPostComment.objects.get(pk=comment.id).delete()
        with self.assertRaises(UserPostComment.DoesNotExist):
            UserPostComment.objects.get(pk=comment.id)

    def test_update_comment(self):
        """Test that comment is updated"""
        comment = mommy.make(UserPostComment)
        updated_content = "Updated UserPostComment Content"
        comment.content = updated_content
        comment.save()
        new_comment = UserPostComment.objects.get(pk=comment.id)
        self.assertEqual(new_comment.content, updated_content)

"""Write more test cases for Community Posts and Comments"""