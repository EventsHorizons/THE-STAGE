from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD if hasattr(User, 'EMAIL_FIELD') else 'email'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'phone', 'role', 'username')
        read_only_fields = ('id',)

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data['email']
        validated_data.setdefault('username', email.split('@')[0])
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'phone', 'role', 'is_email_verified')
        read_only_fields = fields
