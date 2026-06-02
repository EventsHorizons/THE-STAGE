from django.urls import path

from .views import DiscoverFeedView, SwipeView

urlpatterns = [
    path('feed/', DiscoverFeedView.as_view(), name='discover-feed'),
    path('swipe/', SwipeView.as_view(), name='discover-swipe'),
]
