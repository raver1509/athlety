# views.py
from rest_framework import generics, permissions, status
from django.db.models import Q
from .models import CustomUser, Friend_Request
from .serializers import UserProfileSerializer, FriendRequestSerializer, UserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserProfileFilter
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView


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


class SendFriendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        to_user_id = request.data.get('to_user')
        to_user = get_object_or_404(CustomUser, id=to_user_id)

        if Friend_Request.objects.filter(from_user=request.user, to_user=to_user).exists():
            return Response({"detail": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

        if request.user == to_user:
            return Response({"detail": "You cannot send a friend request to yourself."},
                            status=status.HTTP_400_BAD_REQUEST)

        if to_user in request.user.friends.all():
            return Response({"detail": "This user is already your friend."}, status=status.HTTP_400_BAD_REQUEST)

        Friend_Request.objects.create(from_user=request.user, to_user=to_user)
        return Response({"detail": "Friend request sent."}, status=status.HTTP_201_CREATED)


class RespondFriendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        friend_request_id = kwargs.get('request_id')
        action = request.data.get('action')

        friend_request = get_object_or_404(Friend_Request, id=friend_request_id, to_user=request.user)

        if action == "accept":
            # Add friends
            request.user.friends.add(friend_request.from_user)
            friend_request.from_user.friends.add(request.user)
            friend_request.delete()
            return Response({"detail": "Friend request accepted."}, status=status.HTTP_200_OK)
        elif action == "reject":
            friend_request.delete()
            return Response({"detail": "Friend request rejected."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class DeleteFriendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        friend_id = kwargs.get('friend_id')
        friend = get_object_or_404(CustomUser, id=friend_id)

        if friend not in request.user.friends.all():
            return Response({"detail": "This user is not your friend."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.friends.remove(friend)
        friend.friends.remove(request.user)
        return Response({"detail": "Friend removed."}, status=status.HTTP_200_OK)


class OutgoingFriendRequestsView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Friend_Request.objects.filter(from_user=self.request.user)


class IncomingFriendRequestsView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Friend_Request.objects.filter(to_user=self.request.user)


class Friends(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.friends.all()


class SuggestedUsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        user = self.request.user

        sent_requests = Friend_Request.objects.filter(from_user=user).values_list('to_user', flat=True)
        received_requests = Friend_Request.objects.filter(to_user=user).values_list('from_user', flat=True)

        return CustomUser.objects.filter(
            Q(level=user.level) |
            Q(preferred_sports=user.preferred_sports) |
            Q(location=user.location)
        ).exclude(
            id=user.id
        ).exclude(
            friends__in=[user]
        ).exclude(
            id__in=sent_requests
        ).exclude(
            id__in=received_requests
        ).exclude(
            level__isnull=True, preferred_sports__isnull=True, location__isnull=True
        )


class UserDetailView(APIView):
    def get(self, request, user_id, format=None):
        try:
            user = CustomUser.objects.get(pk=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)