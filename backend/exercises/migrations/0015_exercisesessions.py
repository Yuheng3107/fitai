# Generated by Django 4.1.7 on 2023-04-15 07:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('exercises', '0014_remove_exercise_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExerciseSessions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sets', models.PositiveSmallIntegerField(default=1)),
                ('duration', models.PositiveSmallIntegerField()),
                ('reps', models.PositiveSmallIntegerField(default=0)),
                ('perfect_reps', models.PositiveSmallIntegerField(default=0)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercises.exercise')),
                ('exercise_regime', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='exercises.exerciseregime')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]