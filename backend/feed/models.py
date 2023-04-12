from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None, null=True, blank=True, related_name='%(class)s_poster')
    posted_at = models.DateTimeField(auto_now=True)
    #likes
    likes = models.PositiveIntegerField(default=0)
    likers = models.ManyToManyField(User, related_name='%(class)s_likers', blank=True)
    comments = GenericRelation('feed.Comment', content_type_field='parent_type', object_id_field='parent_id')

    class Meta:
        abstract = True

class FeedPost(Post):
    text = models.CharField(max_length=10000, default="")
    media = models.FileField(blank=True, null=True)
    tags = models.ManyToManyField('feed.Tags', blank=True)
    title = models.CharField(max_length=1000, default="")
    # Generic Foreign Key
    shared_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, default=None, blank=True, null=True)
    # Target Table must have a key that is a positive integer
    shared_id = models.PositiveIntegerField(blank=True, null=True, default=None)
    shared_object = GenericForeignKey('shared_type', 'shared_id')

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=["shared_type", "shared_id"]),
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
    text = models.CharField(max_length=2000, default="")

    # Generic Foreign Key
    parent_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True, default=None)
    # Target Table must have a key that is a positive integer
    parent_id = models.PositiveIntegerField(blank=True, null=True, default=None)
    parent_object = GenericForeignKey('parent_type', 'parent_id')
    class Meta:
        indexes = [
            models.Index(fields=["parent_type", "parent_id"]),
        ]
    def __str__(self):
        return f"Comment by {self.poster.username} at {self.parent_object}"
    

class Tags(models.Model):
    tag = models.CharField(max_length=50, unique=True, primary_key=True)
    def __str__(self):
        return self.tag


