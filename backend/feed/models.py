from django.db import models

# Create your models here.
from homepage.models import AppUser  # type: ignore


class Post(models.Model):
    poster = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    likes = models.PositiveSmallIntegerField()
    content = models.CharField(max_length=10000)
    image = models.ImageField()
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.poster.username} posted at {self.posted_at}"


class Comment(models.Model):
    commented_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=5000)
    commenter = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    likes = models.PositiveSmallIntegerField()
    # The post the comment belongs to, when post is deleted comment is deleted
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f"Comment by {self.commenter.username} at {self.commented_at}"
