from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model

User = get_user_model()
<<<<<<< HEAD

class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    banner = models.ImageField()
    created_at = models.DateField(auto_now_add=True)
    private = models.BooleanField(default=False)
=======
>>>>>>> e1e0362e481e8738e2099dc9b6979a3a250416af

# Create your models here.

class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default="Deleted User", related_name='%(class)s_poster')
    posted_at = models.DateTimeField(auto_now_add=True)
    #likes
    likers = models.ManyToManyField(User, related_name='%(class)s_likers')

    class Meta:
        abstract = True

class FeedPost(Post):
    tags = models.ManyToManyField('Tags')
    text = models.CharField(max_length=10000)

    # Generic Foreign Key
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # Target Table must have a key that is a positive integer
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

########
# Posts        

class UserPost(FeedPost):
    privacy_level = models.SmallIntegerField(default=0)
    def __str__(self):
        return f"User Post by {self.poster.username} posted at {self.posted_at}"
    
class CommunityPost(FeedPost):
    # If community is deleted, all posts in community are deleted
    community = models.ForeignKey('community.Community', on_delete=models.CASCADE)
    def __str__(self):
        return f"Community Post by {self.poster.username} posted at {self.posted_at}"

class Comment(Post):
    text = models.CharField(max_length=2000)

    # Generic Foreign Key
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # Target Table must have a key that is a positive integer
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]
    def __str__(self):
        return f"Comment by {self.poster.username} at {self.posted_at}"
    

class Tags(models.Model):
    tag = models.CharField(max_length=50, unique=True, primary_key=True)
    def __str__(self):
        return self.tag


