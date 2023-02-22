from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.views import Response
from django.contrib.auth import get_user_model

class SaveLoginData(APIView):
    def post(self, request):
        user_data = request.data
        # Need to serialize data
        first_name = user_data["first_name"]
        last_name = user_data["last_name"]
        email = user_data["email"]
        User = get_user_model()
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name)
        user.save()

        print(type(user_data))
        print(user_data)
        return Response()
        