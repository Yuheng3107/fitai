# Generated by Django 4.1.7 on 2023-04-11 09:41

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('feed', '0013_alter_communitypost_tags_alter_userpost_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='likers',
            field=models.ManyToManyField(blank=True, null=True, related_name='%(class)s_likers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='communitypost',
            name='likers',
            field=models.ManyToManyField(blank=True, null=True, related_name='%(class)s_likers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userpost',
            name='likers',
            field=models.ManyToManyField(blank=True, null=True, related_name='%(class)s_likers', to=settings.AUTH_USER_MODEL),
        ),
    ]
