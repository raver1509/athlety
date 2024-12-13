from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import Friend_Request

CustomUser = get_user_model()


class UserTests(APITestCase):

    def setUp(self):
        self.user1 = CustomUser.objects.create_user(username='user1', email='user1@example.com', password='password1')
        self.user2 = CustomUser.objects.create_user(username='user2', email='user2@example.com', password='password2')
        self.user3 = CustomUser.objects.create_user(username='user3', email='user3@example.com', password='password3', location='Lublin', level='beginner')

        self.client.login(username='user1', password='password1')

    def test_user_profile(self):
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'user1')

    def test_user_profile_unauthenticated(self):
        self.client.logout()
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_friends_list(self):
        self.user1.friends.add(self.user2)
        response = self.client.get('/api/users/friends/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'user2')

    def test_user_friends_list_unauthenticated(self):
        self.client.logout()
        response = self.client.get('/api/users/friends/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_send_friend_request(self):
        response = self.client.post('/api/users/friends/request/', {'to_user': self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Friend_Request.objects.filter(from_user=self.user1, to_user=self.user2).exists())

    def test_send_friend_request_unauthenticated(self):
        self.client.logout()
        response = self.client.post('/api/users/friends/request/', {'to_user': self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_suggested_users(self):
        self.user1.location = 'Lublin'
        self.user1.level = 'beginner'
        self.user1.save()

        response = self.client.get('/api/users/suggested-users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'user3')

    def test_suggested_users_unauthenticated(self):
        self.client.logout()
        response = self.client.get('/api/users/suggested-users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
