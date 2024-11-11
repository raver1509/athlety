# urls.py in the 'users' app
from django.urls import path
from .views import UserProfileView, UserProfileSearchView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/search/', UserProfileSearchView.as_view(), name='user-profile-search'),
]
