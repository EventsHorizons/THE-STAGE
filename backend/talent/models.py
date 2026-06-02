"""
Talent domain: Profile (TalentCard), MediaAsset, Connection, Match.
Indexed for fast discover queries.
"""

from django.conf import settings
from django.db import models
from django.db.models import Q

from .validators import validate_order_index, validate_short_video_file


class Profile(models.Model):
    """1:1 TalentCard linked to CustomUser (artist) or owned by scout display."""

    class Availability(models.TextChoices):
        IMMEDIATE = 'immediate', 'Immediate'
        PART_TIME = 'part-time', 'Part-time'
        NOT_AVAILABLE = 'not-available', 'Not available'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    name = models.CharField(max_length=120)
    age = models.PositiveSmallIntegerField(default=18)
    category = models.CharField(max_length=80, db_index=True)
    display_category = models.CharField(max_length=120, blank=True)
    city = models.CharField(max_length=80, db_index=True)
    country = models.CharField(max_length=80, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0)
    mini_bio = models.TextField(max_length=280)
    extended_bio = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    experience = models.JSONField(default=list, blank=True)
    goals = models.JSONField(default=list, blank=True)
    availability = models.CharField(
        max_length=20,
        choices=Availability.choices,
        default=Availability.IMMEDIATE,
        db_index=True,
    )
    is_validated = models.BooleanField(default=False, db_index=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    overall_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    technical_stats = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['category', 'availability']),
            models.Index(fields=['city', 'is_validated']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self) -> str:
        return self.name


class MediaAsset(models.Model):
    class MediaType(models.TextChoices):
        VIDEO = 'video', 'Video'
        IMAGE = 'image', 'Image'
        AUDIO = 'audio', 'Audio'

    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='media_assets',
    )
    media_type = models.CharField(max_length=10, choices=MediaType.choices)
    file = models.FileField(upload_to='portfolio/', blank=True, null=True)
    external_url = models.URLField(max_length=500, blank=True)
    order_index = models.PositiveSmallIntegerField(validators=[validate_order_index])
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_index']
        constraints = [
            models.UniqueConstraint(
                fields=['profile', 'order_index'],
                name='unique_media_order_per_profile',
            ),
        ]
        indexes = [
            models.Index(fields=['profile', 'order_index']),
            models.Index(fields=['media_type']),
        ]

    def clean(self):
        from .validators import validate_media_count

        validate_media_count(self.profile_id, exclude_pk=self.pk)
        if self.media_type == self.MediaType.VIDEO and self.file:
            validate_short_video_file(self.file)

    @property
    def url(self) -> str:
        if self.file:
            return self.file.url
        return self.external_url or ''

    def __str__(self) -> str:
        return f'{self.profile.name} #{self.order_index} ({self.media_type})'


class AudioTrack(models.Model):
    """Spotify-style track listing on Bento profile."""

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='audio_tracks')
    title = models.CharField(max_length=160)
    file = models.FileField(upload_to='audio/', blank=True, null=True)
    external_url = models.URLField(max_length=500, blank=True)
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    order_index = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order_index']
        indexes = [models.Index(fields=['profile', 'order_index'])]


class Connection(models.Model):
    """Swipe action log: like, pass, bookmark."""

    class ActionType(models.TextChoices):
        LIKE = 'like', 'Like'
        PASS = 'pass', 'Pass'
        BOOKMARK = 'bookmark', 'Bookmark'

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='connections_sent',
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='connections_received',
    )
    action_type = models.CharField(max_length=10, choices=ActionType.choices, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['sender', 'receiver', 'action_type']),
            models.Index(fields=['receiver', 'action_type', '-created_at']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['sender', 'receiver', 'action_type'],
                name='unique_connection_per_action',
            ),
        ]


class Match(models.Model):
    """Created only on mutual LIKE between two users."""

    user_one = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='matches_as_one',
    )
    user_two = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='matches_as_two',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_one', 'user_two'],
                name='unique_match_pair',
            ),
        ]
        indexes = [
            models.Index(fields=['user_one', '-created_at']),
            models.Index(fields=['user_two', '-created_at']),
        ]

    @staticmethod
    def normalize_pair(user_a_id, user_b_id):
        return (user_a_id, user_b_id) if user_a_id < user_b_id else (user_b_id, user_a_id)

    @classmethod
    def get_between(cls, user_a, user_b):
        u1, u2 = cls.normalize_pair(user_a.id, user_b.id)
        return cls.objects.filter(user_one_id=u1, user_two_id=u2).first()
