[![Django CI](https://github.com/Yuheng3107/fitai/actions/workflows/django.yml/badge.svg?branch=main)](https://github.com/Yuheng3107/fitai/actions/workflows/django.yml) [![React CI using Jest](https://github.com/Yuheng3107/fitai/actions/workflows/node.js.yml/badge.svg)](https://github.com/Yuheng3107/fitai/actions/workflows/node.js.yml)

## To use virtual environment

do `pip install pipenv` to get pipenv
to activate virtual environment: `pipenv shell`
to install dependencies: `pipenv install`

To make sure sessions are active in view, make sure that GET or POST AJAX requests have
credentials included and also csrf token, for example:

## To prevent import error from showing up

`#type: ignore` to ignore the line

## To start PostgreSQL

`sudo systemctl start postgresql.service`

## To interact with PostgreSQL

`sudo -u postgres psql`

## To create database

CREATE DATABASE flex;

## To create user

CREATE USER admin WITH PASSWORD 'P@ssword1234';

### To give superuser

ALTER USER admin WITH SUPERUSER;

### Exercises

## Exercise ID (PK)

0: Side Squat
1: Front Squat
2: Push-Ups
3: Hamstring Stretch Left Leg (side view)
4: Hamstring Stretch Right Leg (side view)

## To get list of exercises

`exercise/list/all` POST

## To update user exercise statistics

`exercise_statistics` GET (PK)
`exercise_statistics/update` POST (exercise_id, perfect_reps, total_reps) at least one of either perfect reps or total reps. THIS AUTOMATICALLY UPDATES GLOBAL STATS
