from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model
from rest_framework import status

from .models import Community, CommunityMembers
from .serializers import CommunitySerializer
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.postgres.search import SearchVector
# Create your views here.
User = get_user_model()

class CommunityCreateView(APIView):
    def post(self, request):
        """To create new community"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["name", "description", "privacy_level"]
        # Check that all the required data is in the post request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)


        # if "media" in request.data(TODO):
            # Check for media type
            # if request.data["media"]
        
        create_fields = ["name", "description", "privacy_level"]
        fields = {field: request.data[field] for field in create_fields if field in request.data}
        # Unpack the dictionary and pass them as keyword arguments to create in UserPost
        community = Community.objects.create(created_by=request.user, **fields)
        request.user.communities.add(community)
        cm = CommunityMembers.objects.get(user=request.user)
        cm.moderator_level = 3
        cm.save()
        return Response(status=status.HTTP_201_CREATED)

class CommunityUpdateView(APIView):
    def put(self, request):
        """For moderators to update details of the community"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["id"]
        # Check that all the required data is in the put request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check that community exists
        community = None
        try:
            community = Community.objects.get(pk=request.data["id"])
        except Community.DoesNotExist:
            return Response("Please put a valid Community id", status=status.HTTP_404_NOT_FOUND)

        # Check that user is a member of the community
        try:
            member = CommunityMembers.objects.get(user=request.user.id, community=community.id)
        except CommunityMembers.DoesNotExist:
            return Response("Editing a community you are not a member of", status=status.HTTP_401_UNAUTHORIZED)

        # need to be moderator level of at least 1
        if member.moderator_level < 1:
            return Response("Editing a community you are not a moderator of", status=status.HTTP_401_UNAUTHORIZED) 

        # SHARED TYPE
        update_fields = ["name", "description", "privacy_level"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        Community.objects.filter(pk=request.data["id"]).update(**fields)

        return Response(status=status.HTTP_200_OK)

class CommunityUpdateBannerView(APIView):
    def post(self, request):
        parser_classes = [FormParser, MultiPartParser]
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["id"]
        # Check that all the required data is in the put request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check that community exists
        community = None
        try:
            community = Community.objects.get(pk=request.data["id"])
        except Community.DoesNotExist:
            return Response("Please put a valid Community id", status=status.HTTP_404_NOT_FOUND)

        # Check that user is a member of the community
        try:
            member = CommunityMembers.objects.get(user=request.user.id, community=community.id)
        except CommunityMembers.DoesNotExist:
            return Response("Editing a community you are not a member of", status=status.HTTP_401_UNAUTHORIZED)

        # need to be moderator level of at least 1
        if member.moderator_level < 1:
            return Response("Editing a community you are not a moderator of", status=status.HTTP_401_UNAUTHORIZED) 
        
        uploaded_file_object = request.FILES.get("photo", None)
        # Check that profile photo is indeed uploaded
        if uploaded_file_object is None:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        # File size in Megabytes
        file_size = uploaded_file_object.size / (1024*1024)
        if file_size > 2:
            return Response("File size greater than 2MB", status=status.HTTP_400_BAD_REQUEST)
        community.banner = uploaded_file_object
        community.save()
        return Response()

class CommunityUpdatePhotoView(APIView):
    def post(self, request):
        parser_classes = [FormParser, MultiPartParser]
        
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        check_fields = ["id"]
        # Check that all the required data is in the put request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check that community exists
        community = None
        try:
            community = Community.objects.get(pk=request.data["id"])
        except Community.DoesNotExist:
            return Response("Please put a valid Community id", status=status.HTTP_404_NOT_FOUND)

        # Check that user is a member of the community
        try:
            member = CommunityMembers.objects.get(user=request.user.id, community=community.id)
        except CommunityMembers.DoesNotExist:
            return Response("Editing a community you are not a member of", status=status.HTTP_401_UNAUTHORIZED)

        # need to be moderator level of at least 1
        if member.moderator_level < 1:
            return Response("Editing a community you are not a moderator of", status=status.HTTP_401_UNAUTHORIZED) 
        
        uploaded_file_object = request.FILES.get("photo", None)
        # Check that profile photo is indeed uploaded
        if uploaded_file_object is None:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        # File size in Megabytes
        file_size = uploaded_file_object.size / (1024*1024)
        if file_size > 2:
            return Response("File size greater than 2MB", status=status.HTTP_400_BAD_REQUEST)
        community.community_photo = uploaded_file_object
        community.save()
        return Response()

class CommunityDetailView(APIView):
    def get(self, request, pk):
        """To get details of community"""
        try:
            community = Community.objects.get(pk=pk)
            serializer = CommunitySerializer(community)
            return Response(serializer.data)
        except Community.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CommunityListView(APIView):
    def post(self, request):
        if "communities" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        communities = Community.objects.filter(pk__in=request.data["communities"])
        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data)

class CommunityDeleteView(APIView):
    def delete(self, request, pk):
        try:
            community = Community.objects.get(pk=pk)
        except Community.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Check User
        try:
            member = CommunityMembers.objects.get(user=request.user.id, community=community.id)
        except CommunityMembers.DoesNotExist:
            return Response("Editing a community you are not a member of", status=status.HTTP_401_UNAUTHORIZED)

        # need to be moderator level of at least 3
        if member.moderator_level < 3:
            return Response("Deleting a community you are not a moderator of", status=status.HTTP_401_UNAUTHORIZED)
        community.delete()
        return Response()

class CommunityMemberUpdateView(APIView):
    def put(self, request):
        User = get_user_model()
        """To update community"""
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        check_fields = ["community_id", "user_id"]
        # Check that all the required data is in the put request
        for field in check_fields:
            if field not in request.data:
                return Response(f"Please add the {field} field in your request", status=status.HTTP_400_BAD_REQUEST)

        # Check that community exists
        try:
            community = Community.objects.get(pk=request.data["community_id"])
        except Community.DoesNotExist:
            return Response("Please put a valid Community id", status=status.HTTP_404_NOT_FOUND)

        # Check Self Moderation
        try:
            self_member = CommunityMembers.objects.get(user=request.user.id, community=community.id)
        except CommunityMembers.DoesNotExist:
            return Response("Editing a community's moderators you are not a member of", status=status.HTTP_401_UNAUTHORIZED)
        # need to be moderator level of at least 2
        if self_member.moderator_level < 2:
            return Response("Editing a community's moderators you are not a moderator of", status=status.HTTP_401_UNAUTHORIZED) 

        # Check user
        try:
            user = User.objects.get(pk=request.data["user_id"])
        except User.DoesNotExist:
            return Response("Please put a valid User id", status=status.HTTP_404_NOT_FOUND)
        # Check Member
        try:
            member = CommunityMembers.objects.get(user=user.id, community=community.id)
        except CommunityMembers.DoesNotExist:
            return Response("Editing a community's moderators for a user who is not a member", status=status.HTTP_400_BAD_REQUEST)

        if request.data["moderator_level"] >= self_member.moderator_level:
            return Response("increasing moderation level to the same or greater than your level", status=status.HTTP_401_UNAUTHORIZED) 

        update_fields = ["moderator_level"]
        fields = {field: request.data[field] for field in update_fields if field in request.data}
        CommunityMembers.objects.filter(pk=member.id).update(**fields)

        return Response(status=status.HTTP_200_OK)

class CommunitySearchView(APIView):
    def post(self, request):
        required_fields = ["content"]
        for field in required_fields:
            if field not in request.data:
                return Response(f"Please put {field} field in post request", status=status.HTTP_400_BAD_REQUEST)
        qs = Community.objects.annotate(
            search=SearchVector("name", "description"),
        ).filter(search=request.data["content"]).order_by('-member_count')
        community_no = qs.count()
        if community_no == 0:
            return Response("No communities matching search terms found", status=status.HTTP_404_NOT_FOUND)
        if community_no > 10:
            # Get top 10 communities with most people if there are more than 10 communities matching search terms
            qs = qs[:10]
        serializer = CommunitySerializer(qs, many=True)
        return Response(serializer.data)