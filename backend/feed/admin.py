from django.contrib import admin
from .models import CommunityPost, UserPost, UserPostComment, CommunityPostComment
# Register your models here.

admin.site.register(UserPost)
admin.site.register(CommunityPost)
admin.site.register(UserPostComment)
admin.site.register(CommunityPostComment)
