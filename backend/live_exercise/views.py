from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.

class HandleKeyPoints(APIView):
    def post(self, request):
        # Data is all in request
        # Put data in json format in Response
        return Response()
        pass
