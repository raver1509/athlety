# serializers.py
from rest_framework import serializers
from .models import CustomUser, Friend_Request


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'level', 'date_of_birth', 'profile_picture', 'preferred_sports', 'location', 'friends']
        read_only_fields = ['username', 'email', 'friends']

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend_Request
        fields = ['id', 'from_user', 'to_user']
        read_only_fields = ['from_user']