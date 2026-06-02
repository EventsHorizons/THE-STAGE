from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import OTPVerification
from .serializers import EmailTokenObtainPairSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        user = serializer.save()
        OTPVerification.issue(user)


class EmailTokenObtainPairView(TokenObtainPairView):
    """POST /api/v1/auth/token/  body: { email, password }"""

    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = (permissions.AllowAny,)


class TokenRefreshPublicView(TokenRefreshView):
    permission_classes = (permissions.AllowAny,)


class OTPVerifyView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        if not email or not code:
            return Response(
                {'detail': 'email and code are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'verified': False}, status=status.HTTP_404_NOT_FOUND)

        otp = (
            OTPVerification.objects.filter(user=user, is_used=False)
            .order_by('-created_at')
            .first()
        )
        if not otp or not otp.is_valid(code):
            return Response({'verified': False}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save(update_fields=['is_used'])
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])
        return Response({'verified': True})


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
