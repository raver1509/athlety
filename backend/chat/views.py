from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        messages = Message.objects.filter(
            sender=request.user, receiver__username=username
        ) | Message.objects.filter(
            sender__username=username, receiver=request.user
        )
        messages = messages.order_by('timestamp')
        return Response([{
            'sender': msg.sender.username,
            'receiver': msg.receiver.username,
            'content': msg.content,
            'timestamp': msg.timestamp,
        } for msg in messages])
