
from rest_framework.views import APIView, Response
from .serializer import AchievementSerializer
from .models import Achievement

# Create your views here.
"""Achievements only need to be read, creation, updating and deletion is done by us, the admins"""
class AchievementView(APIView):
    def post(self, request):
        data = request.data 
        if "achievement_list" not in data:
            return Response()
        achievement_list = data["achievement_list"]
        qs = Achievement.objects.filter(pk__in=achievement_list)
        serializer = AchievementSerializer(qs, many=True)
        return Response(serializer.data)
