from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response


class HandleKeyPoints(APIView):
    def get(self, request):
        print(request.user)
        return Response()
    def post(self, request):
        # Data is all in request
        # Put data in json format in Response
        
        print(request.COOKIES)
        print(request.user)
        print(request.session.items())
        json_data = request.data
        return Response("Success")
