from django.urls import path
from .views import strava_auth, strava_callback, import_strava_data

urlpatterns = [
    path('auth/', strava_auth, name='strava_auth'),
    path('callback/', strava_callback, name='strava_callback'),
    path('import/', import_strava_data, name='import_strava_data'),
]
