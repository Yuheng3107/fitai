from django.contrib import admin
from .models import AppUser

class AppUserAdmin(admin.ModelAdmin):
    
    list_display = ("username", "email", "profile_photo")
    fields = ("username", "email", "profile_photo", "achievements", "friends")
    
admin.site.register(AppUser, AppUserAdmin)