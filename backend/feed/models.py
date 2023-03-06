from django.db import models

# Create your models here.
from homepage.models import AppUser  # type: ignore

class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    banner = models.ImageField()
    created_at = models.DateField(auto_now_add=True)
    private = models.BooleanField(default=False)


class Post(models.Model):
    poster = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    likes = models.PositiveSmallIntegerField()
    content = models.CharField(max_length=10000)
    image = models.ImageField()
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.poster.username} posted at {self.posted_at}"
    
    class Meta:
        abstract = True

class UserPost(Post):
    privacy_level = models.SmallIntegerField(default=0)
    
class CommunityPost(Post):
    # If community is deleted, all posts in community are deleted
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    

class Comment(models.Model):
    commented_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=5000)
    commenter = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    likes = models.PositiveSmallIntegerField()
    # The post the comment belongs to, when post is deleted comment is deleted

    def __str__(self):
        return f"Comment by {self.commenter.username} at {self.commented_at}"
    
    class Meta:
        abstract = True

class UserPostComment(Comment):
    post = models.ForeignKey(UserPost, on_delete=models.CASCADE)
    
class CommunityPostComment(Comment):
    post = post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE)
