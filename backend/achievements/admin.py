from django.contrib import admin
<<<<<<< HEAD

# Register your models here.
=======
from .models import Achievement
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image')


admin.site.register(Achievement, AchievementAdmin)
>>>>>>> a92f66c257841abf52bdcc4b10f42ab9e78ae86b
