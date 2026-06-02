from rest_framework import serializers

from .models import AudioTrack, Connection, Match, MediaAsset, Profile


class MediaAssetSerializer(serializers.ModelSerializer):
    profile_id = serializers.IntegerField(source='profile.id', read_only=True)
    type = serializers.CharField(source='media_type')
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = ('id', 'profile_id', 'type', 'url', 'order_index', 'duration_seconds')

    def get_url(self, obj: MediaAsset) -> str:
        request = self.context.get('request')
        url = obj.url
        if url and request and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url


class AudioTrackSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = AudioTrack
        fields = ('id', 'profile_id', 'title', 'url', 'duration_seconds', 'order_index')

    def get_url(self, obj: AudioTrack) -> str:
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return obj.external_url or ''


class ProfileFeedCardSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id')
    mini_bio = serializers.CharField()
    display_category = serializers.CharField(required=False)
    is_validated = serializers.BooleanField()
    avatar_url = serializers.SerializerMethodField()
    preview_media_url = serializers.SerializerMethodField()
    preview_media_type = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            'id',
            'user_id',
            'name',
            'category',
            'display_category',
            'mini_bio',
            'skills',
            'availability',
            'is_validated',
            'avatar_url',
            'preview_media_url',
            'preview_media_type',
            'location',
        )

    def get_avatar_url(self, obj: Profile) -> str | None:
        if not obj.avatar:
            return None
        request = self.context.get('request')
        url = obj.avatar.url
        return request.build_absolute_uri(url) if request and url.startswith('/') else url

    def get_preview_media_url(self, obj: Profile) -> str | None:
        media = obj.media_assets.order_by('order_index').first()
        if not media:
            return self.get_avatar_url(obj)
        request = self.context.get('request')
        url = media.url
        if request and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url or None

    def get_preview_media_type(self, obj: Profile) -> str | None:
        media = obj.media_assets.order_by('order_index').first()
        return media.media_type if media else 'image'

    def get_location(self, obj: Profile) -> dict:
        return {
            'latitude': float(obj.latitude),
            'longitude': float(obj.longitude),
            'city': obj.city,
            'country': obj.country,
        }


class ProfileDetailSerializer(ProfileFeedCardSerializer):
    user_id = serializers.IntegerField(source='user.id')
    extended_bio = serializers.CharField(required=False)
    media_items = MediaAssetSerializer(source='media_assets', many=True, read_only=True)
    audio_tracks = AudioTrackSerializer(many=True, read_only=True)
    technical_stats = serializers.JSONField()

    class Meta(ProfileFeedCardSerializer.Meta):
        fields = ProfileFeedCardSerializer.Meta.fields + (
            'age',
            'extended_bio',
            'experience',
            'goals',
            'overall_rating',
            'review_count',
            'technical_stats',
            'media_items',
            'audio_tracks',
        )


class ConnectionSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id')
    receiver_id = serializers.IntegerField(source='receiver.id')
    type = serializers.CharField(source='action_type')

    class Meta:
        model = Connection
        fields = ('id', 'sender_id', 'receiver_id', 'type', 'created_at')


class MatchSerializer(serializers.ModelSerializer):
    user_one_id = serializers.IntegerField(source='user_one.id')
    user_two_id = serializers.IntegerField(source='user_two.id')

    class Meta:
        model = Match
        fields = ('id', 'user_one_id', 'user_two_id', 'created_at')


class SwipeRequestSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField(help_text='Target user PK (not profile PK)')
    action_type = serializers.ChoiceField(choices=Connection.ActionType.choices)


class SwipeResponseSerializer(serializers.Serializer):
    connection = ConnectionSerializer()
    match = MatchSerializer(allow_null=True)
    is_mutual = serializers.BooleanField()
