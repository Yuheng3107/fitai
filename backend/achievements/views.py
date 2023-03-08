
from rest_framework.views import APIView, Response
from .serializer import AchievementSerializer
from rest_framework.renderers import JSONRenderer
from .models import Achievement

# Create your views here.
class AchievementView(APIView):
    def put(self, request):
        data = request.data 
        if "achievement_list" not in data:
            return Response()
        achievement_list = data["achievement_list"]
        qs = Achievement.objects.filter(pk__in=achievement_list)
        serializer = AchievementSerializer(qs, many=True)
        return Response(JSONRenderer().render(serializer.data))