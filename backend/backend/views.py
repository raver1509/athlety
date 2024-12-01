from rest_framework.decorators import api_view
from rest_framework.response import Response
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
import requests
from django.urls import reverse
from rest_framework import status
from rest_framework.views import APIView
from urllib.parse import urljoin
from django.conf import settings
from rest_framework.permissions import AllowAny

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

class GoogleLogin(SocialLoginView):
    permission_classes = [AllowAny]
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client


class GoogleLoginCallback(APIView):
    def get(self, request, *args, **kwargs):
        """
        If you are building a fullstack application (eq. with React app next to Django)
        you can place this endpoint in your frontend application to receive
        the JWT tokens there - and store them in the state
        """

        code = request.GET.get("code")

        if code is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Remember to replace the localhost:8000 with the actual domain name before deployment
        token_endpoint_url = urljoin("http://localhost:8000", reverse("google_login"))
        response = requests.post(url=token_endpoint_url, data={"code": code})
        print(response)
        return Response(response.json(), status=status.HTTP_200_OK)

# https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8000/api/v1/auth/google/callback/&prompt=consent&response_type=code&client_id=856476429796-jfh526dlghb1sebe7isidet46t6bdcrg.apps.googleusercontent.com&scope=openid%20email%20profile&access_type=offline