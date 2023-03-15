from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.

class CommunityView(APIView):
    def post(self, request):
        """Creates a community"""
        fields = ["name", "description", "privacy_level"]
        fields = {field: request.data[field] for field in fields if field in request.data}
        # Have to handle banner separately
        if "banner" in fields:
            
            # Clean and process banner data into a file
            pass
        