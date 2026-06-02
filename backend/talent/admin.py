from django.contrib import admin

from .models import AudioTrack, Connection, Match, MediaAsset, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'city', 'availability', 'is_validated')
    list_filter = ('availability', 'is_validated', 'category')
    search_fields = ('name', 'city', 'user__email')


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('profile', 'media_type', 'order_index', 'created_at')
    list_filter = ('media_type',)


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'action_type', 'created_at')
    list_filter = ('action_type',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('user_one', 'user_two', 'created_at')


admin.site.register(AudioTrack)
