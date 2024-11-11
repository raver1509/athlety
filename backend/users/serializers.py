# serializers.py
from rest_framework import serializers
from .models import CustomUser


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'level', 'age', 'profile_picture', 'preferred_sports', 'location']
        read_only_fields = ['username', 'email']  # Make username and email read-only in profile updates
