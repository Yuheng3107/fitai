from django.contrib import admin
from .models import CommunityPost, UserPost, Comment
# Register your models here.

admin.site.register(UserPost)
admin.site.register(CommunityPost)
admin.site.register(Comment)
