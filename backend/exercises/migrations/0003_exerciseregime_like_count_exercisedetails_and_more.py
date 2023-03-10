# Generated by Django 4.1.7 on 2023-03-10 13:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('exercises', '0002_alter_exerciseregime_poster'),
    ]

    operations = [
        migrations.AddField(
            model_name='exerciseregime',
            name='like_count',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.CreateModel(
            name='ExerciseDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveSmallIntegerField(default=0)),
                ('rep_count', models.PositiveSmallIntegerField(default=10)),
                ('set_count', models.PositiveSmallIntegerField(default=3)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercises.exercise')),
                ('exercise_regime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercises.exerciseregime')),
            ],
        ),
        migrations.RemoveField(
            model_name='exerciseregime',
            name='exercises',
        ),
        migrations.AddField(
            model_name='exerciseregime',
            name='exercises',
            field=models.ManyToManyField(through='exercises.ExerciseDetails', to='exercises.exercise'),
        ),
    ]