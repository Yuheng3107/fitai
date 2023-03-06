# Generated by Django 4.1.7 on 2023-03-06 04:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('feed', '0002_community_userpost_communitypost_alter_comment_post_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Comment',
            new_name='UserPostComment',
        ),
        migrations.CreateModel(
            name='CommunityPostComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('commented_at', models.DateTimeField(auto_now_add=True)),
                ('content', models.CharField(max_length=5000)),
                ('likes', models.PositiveSmallIntegerField()),
                ('commenter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.communitypost')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]