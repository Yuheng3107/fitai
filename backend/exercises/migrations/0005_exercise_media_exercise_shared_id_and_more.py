# Generated by Django 4.1.7 on 2023-03-10 16:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('feed', '0010_comment_like_count_communitypost_like_count_and_more'),
        ('exercises', '0004_remove_exercise_image_exercise_like_count_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='media',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='exercise',
            name='shared_id',
            field=models.PositiveIntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='shared_type',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='tags',
            field=models.ManyToManyField(to='feed.tags'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='text',
            field=models.CharField(max_length=10000, null=True),
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='media',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='shared_id',
            field=models.PositiveIntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='shared_type',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='tags',
            field=models.ManyToManyField(to='feed.tags'),
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='text',
            field=models.CharField(max_length=10000, null=True),
        ),
        migrations.AddIndex(
            model_name='exercise',
            index=models.Index(fields=['shared_type', 'shared_id'], name='exercises_e_shared__26d786_idx'),
        ),
        migrations.AddIndex(
            model_name='exerciseregime',
            index=models.Index(fields=['shared_type', 'shared_id'], name='exercises_e_shared__08aa51_idx'),
        ),
    ]
