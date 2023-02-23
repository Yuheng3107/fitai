from django.shortcuts import render

from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model, login, authenticate

class SaveLoginData(APIView):
    def post(self, request):
        user_data = request.data
        print(user_data)
        # Need to serialize data
        first_name = user_data["first_name"]
        last_name = user_data["last_name"]
        email = user_data["email"]
        username = f"{first_name} {last_name}"
        User = get_user_model()
        print(request.user)
        try:
            user = User.objects.get(email=email)
            login(request, user)
            return Response("User already in database")
        except User.DoesNotExist:
            user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, username=username)
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            user.save()
            login(request, user)
            print(request.user)
        print(request.session.items())
        # Session not saved throughout views
        return Response("User Successfully Registered")
    
def index(request):
    return render(request, 'index.html')