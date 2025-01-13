from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer


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

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
