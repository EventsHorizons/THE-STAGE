from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser, OTPVerification


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'role', 'is_email_verified', 'is_staff')
    list_filter = ('role', 'is_email_verified')
    search_fields = ('email', 'username')
    ordering = ('email',)
    fieldsets = UserAdmin.fieldsets + (
        ('The Stage', {'fields': ('role', 'phone', 'is_email_verified')}),
    )


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'expires_at', 'is_used', 'created_at')
    readonly_fields = ('created_at',)
