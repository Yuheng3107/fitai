# Generated by Django 4.1.7 on 2023-03-12 10:24

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercises', '0007_rename_like_count_exercise_likes_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exerciseregime',
            name='exercises',
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='exercises',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.PositiveSmallIntegerField(), default=None, size=None),
            preserve_default=False,
        ),
    ]