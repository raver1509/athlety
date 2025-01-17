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


class OutgoingFriendRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        requests = Friend_Request.objects.filter(from_user=request.user)
        data = []

        for friend_request in requests:
            request_data = FriendRequestSerializer(friend_request).data
            to_user = CustomUser.objects.get(id=friend_request.to_user_id)
            request_data['to_user_username'] = to_user.username
            data.append(request_data)

        return Response(data, status=status.HTTP_200_OK)


class IncomingFriendRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        requests = Friend_Request.objects.filter(to_user=request.user)
        data = []

        for friend_request in requests:
            request_data = FriendRequestSerializer(friend_request).data
            from_user = CustomUser.objects.get(id=friend_request.from_user_id)
            request_data['from_user_username'] = from_user.username
            data.append(request_data)

        return Response(data, status=status.HTTP_200_OK)


class CancelFriendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        to_user_id = kwargs.get('to_user_id')
        to_user = get_object_or_404(CustomUser, id=to_user_id)

        friend_request = Friend_Request.objects.filter(from_user=request.user, to_user=to_user).first()
        if not friend_request:
            return Response({"detail": "No pending friend request found."}, status=status.HTTP_400_BAD_REQUEST)

        friend_request.delete()

        return Response({"detail": "Friend request canceled."}, status=status.HTTP_200_OK)


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
        except user.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
