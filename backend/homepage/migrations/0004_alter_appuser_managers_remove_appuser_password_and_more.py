# Generated by Django 4.1.7 on 2023-02-21 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homepage', '0003_rename_user_appuser'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='appuser',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='appuser',
            name='password',
        ),
        migrations.AddField(
            model_name='appuser',
            name='name',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='email',
            field=models.EmailField(max_length=100, unique=True, verbose_name='email address'),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='username',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
