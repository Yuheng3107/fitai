from django.test import TestCase
import os
from .models import Post, Comment
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from model_mommy import mommy
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
        dir_path = os.path.join(dir_path, 'static/media')
        files = os.listdir(dir_path)
        for file in files:
            if file.endswith('.gif'):
                os.remove(os.path.join(dir_path, file))

    def test_delete_post(self):
        """Test that post can be deleted properly"""
        post = mommy.make(Post)
        Post.objects.get(pk=post.id).delete()
        with self.assertRaises(Post.DoesNotExist):
            Post.objects.get(pk=post.id)

    def test_update_post(self):
        """Test that post can be updated"""
        post = mommy.make(Post)
        updated_content = "New Post Content"
        post.content = updated_content
        post.save()
        updated_post = Post.objects.get(pk=post.id)
        self.assertEqual(updated_post.content, updated_content)


class CommentTestCase(TestCase):
    User = get_user_model()

    def test_create_comment(self):
        post = mommy.make(Post)
        # Check that post was created
        self.assertIsInstance(post, Post)
        user = self.User.objects.create_user(
            email='testuser@gmail.com', password='12345')
        content = "Test Comment Content"
        likes = 69
        comment = Comment.objects.create(
            content=content, post=post, commenter=user, likes=likes)
        self.assertEqual(comment.content, content)
        self.assertEqual(comment.post, post)
        self.assertEqual(comment.commenter, user)
        self.assertEqual(comment.likes, likes)

    def test_delete_commenter(self):
        """To test whether comment is deleted after commenter is deleted"""
        user = mommy.make(self.User)
        comment = mommy.make(Comment, commenter=user)
        self.assertIsInstance(comment, Comment)
        self.User.objects.get(pk=user.id).delete()
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(pk=comment.id)

    def test_delete_comment(self):
        """Test that we cannot retrieve comment once deleted"""
        comment = mommy.make(Comment)
        Comment.objects.get(pk=comment.id).delete()
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(pk=comment.id)

    def test_update_comment(self):
        """Test that comment is updated"""
        comment = mommy.make(Comment)
        updated_content = "Updated Comment Content"
        comment.content = updated_content
        comment.save()
        new_comment = Comment.objects.get(pk=comment.id)
        self.assertEqual(new_comment.content, updated_content)
