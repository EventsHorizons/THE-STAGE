"""
CustomUser + OTP verification for secure onboarding.
"""

import secrets
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ARTIST = 'artist', 'Artist'
        SCOUT = 'scout', 'Scout'
        ADMIN = 'admin', 'Admin'

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.ARTIST)
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['email']),
        ]

    def __str__(self) -> str:
        return f'{self.email} ({self.role})'


class OTPVerification(models.Model):
    """One-time code for email verification after registration."""

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='otp_codes')
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'code']),
            models.Index(fields=['expires_at']),
        ]

    @classmethod
    def issue(cls, user: CustomUser, ttl_minutes: int = 10) -> 'OTPVerification':
        code = f'{secrets.randbelow(1_000_000):06d}'
        return cls.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )

    def is_valid(self, raw_code: str) -> bool:
        if self.is_used or timezone.now() > self.expires_at:
            return False
        return secrets.compare_digest(self.code, raw_code)
