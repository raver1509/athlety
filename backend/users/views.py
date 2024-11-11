# views.py
from rest_framework import generics, permissions
from .models import CustomUser
from .serializers import UserProfileSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserProfileFilter

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get the profile of the currently authenticated user
        return self.request.user

class UserProfileSearchView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserProfileFilter