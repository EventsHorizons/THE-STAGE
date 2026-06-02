from rest_framework import generics, permissions

from .models import Group
from .serializers import GroupSerializer


class GroupListView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Group.objects.filter(
            memberships__user=self.request.user,
        ).distinct()


class GroupDetailView(generics.RetrieveAPIView):
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Group.objects.prefetch_related('memberships')
