from channels.testing import WebsocketCommunicator
from django.test import TestCase
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from backend.routing import application

CustomUser = get_user_model()


class ChatTestCase(TestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username="user1", email="user1@example.com", password="password1"
        )
        self.user2 = CustomUser.objects.create_user(
            username="user2", email="user2@example.com", password="password2"
        )

    async def test_chat_websocket(self):
        await sync_to_async(self.client.login)(username="user1", password="password1")

        communicator = WebsocketCommunicator(application, f"/ws/chat/{self.user2.username}/")
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        message = {"message": "Hello, user2!"}
        await communicator.send_json_to(message)

        response = await communicator.receive_json_from()
        self.assertEqual(response["message"], "Hello, user2!")

        await communicator.disconnect()
