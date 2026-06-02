"""
Media validators — max 7 assets per profile, TikTok-friendly video constraints.
"""

import os

from django.conf import settings
from django.core.exceptions import ValidationError


MAX_MEDIA_ITEMS = 7
MAX_ORDER_INDEX = 6


def validate_order_index(value: int) -> None:
    if value < 0 or value > MAX_ORDER_INDEX:
        raise ValidationError(f'order_index must be between 0 and {MAX_ORDER_INDEX}.')


def validate_media_count(profile_id, exclude_pk=None) -> None:
    from .models import MediaAsset

    qs = MediaAsset.objects.filter(profile_id=profile_id)
    if exclude_pk:
        qs = qs.exclude(pk=exclude_pk)
    if qs.count() >= MAX_MEDIA_ITEMS:
        raise ValidationError(f'A profile cannot have more than {MAX_MEDIA_ITEMS} media items.')


def validate_short_video_file(file_obj) -> None:
    """Enforce size and extension for vertical short-form clips."""
    if not file_obj:
        return

    ext = os.path.splitext(file_obj.name)[1].lstrip('.').lower()
    allowed = getattr(settings, 'MEDIA_ALLOWED_VIDEO_EXTENSIONS', ['mp4', 'mov', 'webm'])
    if ext not in allowed:
        raise ValidationError(f'Video format .{ext} not allowed. Use: {", ".join(allowed)}')

    max_bytes = getattr(settings, 'MEDIA_MAX_VIDEO_MB', 50) * 1024 * 1024
    if file_obj.size > max_bytes:
        raise ValidationError(
            f'Video exceeds {settings.MEDIA_MAX_VIDEO_MB}MB limit for mobile streaming.'
        )
