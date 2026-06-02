from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    EmailTokenObtainPairView,
    MeView,
    OTPVerifyView,
    RegisterView,
    TokenRefreshPublicView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('token/', EmailTokenObtainPairView.as_view(), name='auth-token'),
    path('token/refresh/', TokenRefreshPublicView.as_view(), name='auth-token-refresh'),
    path('otp/verify/', OTPVerifyView.as_view(), name='auth-otp-verify'),
    path('me/', MeView.as_view(), name='auth-me'),
]

# Fallback alias if client posts username instead of email
urlpatterns.append(
    path('login/', TokenObtainPairView.as_view(), name='auth-login-legacy'),
)
