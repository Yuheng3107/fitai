from django.contrib import admin
from .models import AppUser, Achievement


class AppUserAdmin(admin.ModelAdmin):
    
    list_display = ("username", "email", "profile_photo")
    fields = ("username", "email", "profile_photo", "achievements")
    


class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image')

admin.site.register(AppUser, AppUserAdmin)
admin.site.register(Achievement, AchievementAdmin)
