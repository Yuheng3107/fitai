from django.test import TestCase
import os
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.contenttypes.models import ContentType
from model_bakery import baker

from .models import UserPost, CommunityPost, Comment, Tags
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
    
            