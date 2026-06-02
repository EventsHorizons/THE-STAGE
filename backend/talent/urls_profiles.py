from django.urls import path

from .views import ProfileDetailView, ProfileMeUpdateView

urlpatterns = [
    path('me/', ProfileMeUpdateView.as_view(), name='profile-me'),
    path('<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
]
