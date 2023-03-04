from django.test import TestCase
import os
from .models import Post, Comment
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
# Create your tests here.


class PostTestCase(TestCase):
    User = get_user_model()

    def test_create_post(self):
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        content = "Test Post Content"
        likes = 69
        image = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        post = Post.objects.create(
            poster=user, likes=likes, content=content, image=image)
        self.assertEqual(post.poster, user)
        self.assertEqual(post.likes, likes)
        self.assertEqual(post.content, content)
        self.assertEqual(post.image.name, image.name)
        post.save()
        """Test whether post can be retrieved and whether fields are the same"""
        saved_post = Post.objects.get(poster=user)
        self.assertEqual(saved_post.poster, user)
        self.assertEqual(saved_post.likes, likes)
        self.assertEqual(saved_post.content, content)
        self.assertEqual(saved_post.image.name, image.name)
        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))


class CommentTestCase(TestCase):
    User = get_user_model()

    def test_create_comment(self):
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        content = "Test Post Content"
        likes = 69
        image = SimpleUploadedFile(
            'small.gif', small_gif, content_type='image/gif')
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        post = Post.objects.create(
            poster=user, likes=likes, content=content, image=image)
        content = "Test Comment Content"
        likes = 69
        comment = Comment.objects.create(
            content=content, post=post, commenter=user, likes=likes)
        self.assertEqual(comment.content, content)
        self.assertEqual(comment.post, post)
        self.assertEqual(comment.commenter, user)
        self.assertEqual(comment.likes, likes)
        # Clean up .gif file produced
        dir_path = os.getcwd()
        dir_path = os.path.join(dir_path, 'static')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_delete_commenter(self):
        """To test whether comment is deleted after commenter is deleted"""
        pass
