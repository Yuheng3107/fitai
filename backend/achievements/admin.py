from django.contrib import admin
from .models import Achievement


class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image')


admin.site.register(Achievement, AchievementAdmin)
