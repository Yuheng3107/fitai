
from rest_framework.views import APIView, Response
from .serializer import AchievementSerializer
from .models import Achievement

# Create your views here.
"""Achievements only need to be read, creation, updating and deletion is done by us, the admins"""

class AchievementListView(APIView):
    def get(self, request):
        """Get all the achievements"""
        qs = Achievement.objects.all()
        serializer = AchievementSerializer(qs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Get achievements corresponding to the list sent"""
        data = request.data 
        if "achievement_list" not in data:
            return Response()
        achievement_list = data["achievement_list"]
        qs = Achievement.objects.filter(pk__in=achievement_list)
        serializer = AchievementSerializer(qs, many=True)
        return Response(serializer.data)