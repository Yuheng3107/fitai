# Generated by Django 4.1.7 on 2023-03-12 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercises', '0008_remove_exerciseregime_exercises_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='text',
            field=models.CharField(default='', max_length=10000),
        ),
        migrations.AlterField(
            model_name='exerciseregime',
            name='text',
            field=models.CharField(default='', max_length=10000),
        ),
    ]