from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AppUser, Achievement

from .forms import AppUserCreationForm, AppUserChangeForm


class UserAchievementsInlineAdmin(admin.TabularInline):
    model = Achievement
    fk_name = "achievement"


class AppUserAdmin(UserAdmin):
    add_form = AppUserCreationForm
    form = AppUserChangeForm
    model = AppUser

    inlines = [UserAchievementsInlineAdmin]
    list_display = ("email", "is_staff", "is_active",)
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff",
         "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
         ),
    )
    search_fields = ("email",)
    ordering = ("email",)

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).prefetch_related("user_achievements")

    @admin.display(description='Courses')
    def teacher_courses(self, user):
        return [c.name for c in user.user_achievements.all()]


class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image')


admin.site.register(AppUser, UserAdmin)
admin.site.register(Achievement, AchievementAdmin)
