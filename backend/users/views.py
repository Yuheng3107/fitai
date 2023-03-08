from rest_framework import status
from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model, login
from django.http import HttpResponse
from django.middleware.csrf import get_token
from .serializer import UserSerializer
from rest_framework.renderers import JSONRenderer


class LoginDataView(APIView):
    def post(self, request):
        user_data = request.data
        # Need to serialize data
        first_name = user_data["first_name"]
        last_name = user_data["last_name"]
        email = user_data["email"]
        username = f"{first_name} {last_name}"
        User = get_user_model()
        print(request.user)
        response = HttpResponse()
        csrf_token = get_token(request)
        try:
            user = User.objects.get(email=email)
            login(request, user)
            print(request.user)
            response.write("User already in database")
            return response
        except User.DoesNotExist:
            user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, username=username)
            user.save()
            login(request, user)
            response.write("User Successfully Registered")
            print(request.user)
        # Session not saved throughout views
        return response
    
    def get(self, request):
        if (request.user.is_authenticated):
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        else:
            return Response(False, status=status.HTTP_401_UNAUTHORIZED)

        
class CheckLoginStatus(APIView):
    def get(self, request):
        return Response(request.user.is_authenticated)