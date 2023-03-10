# Generated by Django 4.1.7 on 2023-03-10 17:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0007_rename_content_chatmessage_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatgroup',
            name='created_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, related_name='creator', to=settings.AUTH_USER_MODEL),
        ),
    ]
