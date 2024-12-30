import requests
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta

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


@api_view(['GET'])
def strava_callback(request):
    code = request.GET.get('code')
    if not code:
        return Response({'error': 'No code provided'}, status=400)

    response = requests.post(STRAVA_TOKEN_URL, data={
        'client_id': settings.STRAVA_CLIENT_ID,
        'client_secret': settings.STRAVA_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code'
    })
    if response.status_code != 200:
        return Response({'error': 'Failed to authenticate with Strava'}, status=response.status_code)

    tokens = response.json()
    request.session['strava_access_token'] = tokens['access_token']
    request.session['strava_refresh_token'] = tokens['refresh_token']
    request.session['strava_token_expires_at'] = datetime.fromtimestamp(tokens['expires_at']).isoformat()

    return Response({'message': 'Strava connected successfully'})


from django.utils.timezone import now

@api_view(['POST'])
def import_strava_data(request):
    user = request.user
    if not user.strava_access_token:
        return Response({'error': 'Strava is not connected'}, status=400)

    # Sprawdzenie ważności tokenu
    if user.strava_token_expires_at <= now():  # Użyj `now()` zamiast `datetime.now()`
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

    activities_response = requests.get(STRAVA_ACTIVITIES_URL, headers={
        'Authorization': f"Bearer {user.strava_access_token}"
    })
    if activities_response.status_code != 200:
        return Response({'error': 'Failed to fetch data from Strava'}, status=activities_response.status_code)

    activities = activities_response.json()

    total_distance = sum(activity['distance'] for activity in activities if 'distance' in activity)
    total_elevation = sum(
        activity['total_elevation_gain'] for activity in activities if 'total_elevation_gain' in activity)
    user.total_rides = len(activities)
    user.total_distance = total_distance / 1000  # Konwersja z metrów na kilometry
    user.total_elevation_gain = total_elevation
    user.save()

    return Response({'message': 'Data imported successfully'})
