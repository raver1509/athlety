import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from chat.models import Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        current_user_id = self.scope['user'].id if self.scope['user'].id else int(self.scope['query_string'])
        other_user_id = self.scope['url_route']['kwargs']['id']
        room_name = (
            f'{current_user_id}_{other_user_id}'
            if int(current_user_id) > int(other_user_id)
            else f'{other_user_id}_{current_user_id}'
        )
        self.room_group_name = f'chat_{room_name}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        messages = await self.get_messages()
        await self.send(
            text_data=json.dumps(
                {
                    'type': 'messages',
                    'messages': messages
                }
            )
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        sender_username = data['senderUsername']

        sender = await self.get_user(sender_username)
        if not sender:
            await self.send(
                text_data=json.dumps({'error': 'Invalid sender.'})
            )
            return

        await self.save_message(sender=sender, message=message, thread_name=self.room_group_name)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'senderUsername': sender_username,
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps({
                'type': 'message',
                'message': event['message'],
                'senderUsername': event['senderUsername'],
            })
        )

    @database_sync_to_async
    def get_user(self, username):
        return get_user_model().objects.filter(username=username).first()

    @database_sync_to_async
    def get_messages(self):
        messages = Message.objects.filter(thread_name=self.room_group_name).select_related('sender').order_by(
            'timestamp')
        return [
            {
                'senderUsername': message.sender.username,
                'message': message.message,
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for message in messages
        ]

    @database_sync_to_async
    def save_message(self, sender, message, thread_name):
        new_message = Message.objects.create(sender=sender, message=message, thread_name=thread_name)
        return {
            'senderUsername': new_message.sender.username,
            'message': new_message.message,
            'timestamp': new_message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        }
