from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Connection, Profile
from .serializers import (
    ProfileDetailSerializer,
    ProfileFeedCardSerializer,
    SwipeRequestSerializer,
    SwipeResponseSerializer,
)
from .services import process_swipe

User = get_user_model()


class DiscoverFeedView(generics.ListAPIView):
    """
    GET /api/v1/discover/feed/
    Query: category, city, availability, latitude, longitude, radius_km
    Excludes profiles the user already passed.
    """

    serializer_class = ProfileFeedCardSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        passed_ids = Connection.objects.filter(
            sender=user,
            action_type=Connection.ActionType.PASS,
        ).values_list('receiver_id', flat=True)

        qs = (
            Profile.objects.select_related('user')
            .prefetch_related('media_assets')
            .exclude(user=user)
            .exclude(user_id__in=passed_ids)
        )

        category = self.request.query_params.get('category')
        city = self.request.query_params.get('city')
        availability = self.request.query_params.get('availability')

        if category:
            qs = qs.filter(Q(category__icontains=category) | Q(display_category__icontains=category))
        if city:
            qs = qs.filter(city__icontains=city)
        if availability:
            qs = qs.filter(availability=availability)

        return qs.order_by('-is_validated', '-updated_at')[:50]


class SwipeView(APIView):
    """POST /api/v1/discover/swipe/"""

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = SwipeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        receiver_id = serializer.validated_data['receiver_id']
        action_type = serializer.validated_data['action_type']

        if str(receiver_id) == str(request.user.id):
            return Response(
                {'detail': 'Cannot swipe on yourself'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = process_swipe(
            sender=request.user,
            receiver_id=str(receiver_id),
            action_type=action_type,
        )

        payload = {
            'connection': result['connection'],
            'match': result['match'],
            'is_mutual': result['is_mutual'],
        }
        return Response(SwipeResponseSerializer(payload, context={'request': request}).data)


class ProfileDetailView(generics.RetrieveAPIView):
    """GET /api/v1/profiles/<uuid:pk>/ — full Bento payload."""

    serializer_class = ProfileDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Profile.objects.prefetch_related('media_assets', 'audio_tracks')


class ProfileMeUpdateView(generics.UpdateAPIView):
    """PATCH /api/v1/profiles/me/ — owner only."""

    serializer_class = ProfileDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return Profile.objects.get(user=self.request.user)
