from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatHistoryView
from . import views

router = DefaultRouter()
router.register(r'messages', views.MessageViewSet)
router.register(r'conversations', views.ConversationViewSet)

urlpatterns = [
    path('history/<str:username>/', ChatHistoryView.as_view(), name='chat-history'),
    path('api/', include(router.urls)),
]
