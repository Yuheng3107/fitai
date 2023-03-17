from rest_framework import status
from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model, login
from django.http import HttpResponse
from django.middleware.csrf import get_token
from .serializer import UserSerializer
from rest_framework.renderers import JSONRenderer

class UserCreateView(APIView):
    def post(self, request):
        # Need to serialize data
        fields = ["first_name", "last_name", "email"]
        # Ensures all fields are there
        for field in fields:
            if field not in request.data:
                return Response(f"Please input data into {field}", status=status.HTTP_400_BAD_REQUEST)
        fields = {field: request.data[field] for field in fields}
        fields["username"] = f"{fields['first_name']} {fields['last_name']}"
        User = get_user_model()
        response = HttpResponse()
        csrf_token = get_token(request)
        try:
            user = User.objects.get(email=fields["email"])
            login(request, user)
            response.write("User already in database")
            return response
        except User.DoesNotExist:
            user = User.objects.create_user(**fields)
            user.save()
            login(request, user)
            response.write("User Successfully Registered")
        return response
    
class UserDetailView(APIView):
    def get(self, request):
        if (request.user.is_authenticated):
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        else:
            return Response(False, status=status.HTTP_401_UNAUTHORIZED)
    
        
class CheckLoginStatus(APIView):
    def get(self, request):
        return Response(request.user.is_authenticated)