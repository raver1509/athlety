# urls.py in the 'users' app
from django.urls import path
from .views import UserProfileView, UserProfileSearchView, SendFriendRequestView, RespondFriendRequestView, \
    DeleteFriendView, OutgoingFriendRequestsView, IncomingFriendRequestsView, SuggestedUsersView, Friends, \
    UserDetailView, CancelFriendRequestView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('suggested-users/', SuggestedUsersView.as_view(), name='suggested-users'),
    path('profile/search/', UserProfileSearchView.as_view(), name='user-profile-search'),
    path('friends/', Friends.as_view(), name='friends'),
    path('friends/request/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('friends/request/<int:request_id>/', RespondFriendRequestView.as_view(), name='respond-friend-request'),
    path('friends/remove/<int:friend_id>/', DeleteFriendView.as_view(), name='delete-friend'),
    path('friends/requests/outgoing/', OutgoingFriendRequestsView.as_view(), name='outgoing-friend-requests'),
    path('friends/requests/incoming/', IncomingFriendRequestsView.as_view(), name='incoming-friend-requests'),
    path('friends/requests/cancel/<int:to_user_id>/', CancelFriendRequestView.as_view(), name='cancel-friend-request'),
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
]
