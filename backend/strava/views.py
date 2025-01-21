import requests
from django.shortcuts import redirect
from django.conf import settings
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from rest_framework.views import APIView

STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize"
STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"
STRAVA_ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities"


@api_view(['GET'])
def strava_auth(request):
    client_id = settings.STRAVA_CLIENT_ID
    redirect_uri = settings.STRAVA_REDIRECT_URI
    scope = "read,activity:read_all"
    return redirect(
        f"{STRAVA_AUTH_URL}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}")


# @api_view(['GET'])
# def strava_callback(request):
#     code = request.GET.get('code')
#     if not code:
#         return Response({'error': 'No code provided'}, status=400)
#
#     response = requests.post(STRAVA_TOKEN_URL, data={
#         'client_id': settings.STRAVA_CLIENT_ID,
#         'client_secret': settings.STRAVA_CLIENT_SECRET,
#         'code': code,
#         'grant_type': 'authorization_code'
#     })
#     if response.status_code != 200:
#         return Response({'error': 'Failed to authenticate with Strava'}, status=response.status_code)
#
#     tokens = response.json()
#     user = request.user
#     user.strava_access_token = tokens['access_token']
#     user.strava_refresh_token = tokens['refresh_token']
#     user.strava_token_expires_at = datetime.fromtimestamp(tokens['expires_at'])
#     user.save()
#
#     return Response({'message': 'Strava connected successfully'})


@api_view(['GET'])
def strava_callback(request):
    code = request.GET.get('code')
    if not code:
        return Response({'error': 'No code provided'}, status=400)

    # Exchange code for token
    response = requests.post(STRAVA_TOKEN_URL, data={
        'client_id': settings.STRAVA_CLIENT_ID,
        'client_secret': settings.STRAVA_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code'
    })
    if response.status_code != 200:
        return Response({'error': 'Failed to authenticate with Strava'}, status=response.status_code)

    tokens = response.json()

    # Save tokens in the user model
    user = request.user
    user.strava_access_token = tokens['access_token']
    user.strava_refresh_token = tokens['refresh_token']
    user.strava_token_expires_at = datetime.fromtimestamp(tokens['expires_at'])
    user.save()

    # Redirect to the frontend with a success indication
    return redirect('http://localhost:5173/statistics?success=true')


@api_view(['POST'])
def import_strava_data(request):
    user = request.user
    if not user.strava_access_token:
        return Response({'error': 'Strava is not connected'}, status=400)

    # Sprawdzamy, czy token wygasł i odświeżamy go, jeśli to konieczne
    if user.strava_token_expires_at <= now():
        refresh_response = requests.post(STRAVA_TOKEN_URL, data={
            'client_id': settings.STRAVA_CLIENT_ID,
            'client_secret': settings.STRAVA_CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': user.strava_refresh_token
        })
        if refresh_response.status_code == 200:
            tokens = refresh_response.json()
            user.strava_access_token = tokens['access_token']
            user.strava_refresh_token = tokens['refresh_token']
            user.strava_token_expires_at = datetime.fromtimestamp(tokens['expires_at'])
            user.save()
        else:
            return Response({'error': 'Failed to refresh token'}, status=refresh_response.status_code)

    # Pobieranie wszystkich aktywności użytkownika
    activities_response = requests.get(STRAVA_ACTIVITIES_URL, headers={
        'Authorization': f"Bearer {user.strava_access_token}"
    }, params={
        'per_page': 200,  # Pobieranie większej ilości danych (max 200 na zapytanie)
        'page': 1  # Można dodawać strony dla jeszcze większej liczby aktywności
    })
    if activities_response.status_code != 200:
        return Response({'error': 'Failed to fetch data from Strava'}, status=activities_response.status_code)

    activities = activities_response.json()

    # Agregowanie danych o aktywnościach
    total_distance = sum(activity['distance'] for activity in activities if 'distance' in activity)
    total_elevation = sum(activity['total_elevation_gain'] for activity in activities if 'total_elevation_gain' in activity)
    total_time = sum(activity['moving_time'] for activity in activities if 'moving_time' in activity)
    total_activities = len(activities)

    # Dodatkowe dane - średnia prędkość
    total_speed = sum(activity['average_speed'] for activity in activities if 'average_speed' in activity) / total_activities if total_activities else 0

    # Słownik z wszystkimi danymi
    detailed_data = {
        "total_activities": total_activities,
        "total_distance_km": total_distance / 1000,  # Konwersja na kilometry
        "total_elevation_gain_m": total_elevation,  # Wysokość w metrach
        "total_time_min": total_time // 60,  # Czas w minutach
        "average_speed_mps": total_speed,  # Średnia prędkość
        "activities_details": activities  # Szczegóły aktywności
    }

    # Zapisanie danych w modelu użytkownika (na przykład wstawienie sumy)
    user.total_rides = total_activities
    user.total_distance = total_distance / 1000  # W km
    user.total_elevation_gain = total_elevation
    user.total_time = total_time // 60  # W minutach
    user.average_speed = total_speed
    user.save()

    return Response(detailed_data)



class StravaAccessTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        access_token = user.strava_access_token
        refresh_token = user.strava_refresh_token
        token_expires_at = user.strava_token_expires_at

        # if not access_token or not refresh_token or not token_expires_at:
        #     return Response({'error': 'Strava tokens not found'}, status=404)

        return Response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_expires_at': token_expires_at
        }, status=200)
