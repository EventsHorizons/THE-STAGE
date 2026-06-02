"""
Project groups, memberships, and linked group conversations.
"""

from django.conf import settings
from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='groups_created',
    )
    avatar = models.ImageField(upload_to='group_avatars/', blank=True, null=True)
    projects_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['projects_active', '-created_at']),
            models.Index(fields=['created_by']),
        ]

    def __str__(self) -> str:
        return self.name


class GroupMember(models.Model):
    class Role(models.TextChoices):
        LEADER = 'leader', 'Leader'
        COLLABORATOR = 'collaborator', 'Collaborator'

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='group_memberships',
    )
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.COLLABORATOR)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['group', 'user'], name='unique_group_member'),
        ]
        indexes = [
            models.Index(fields=['group', 'role']),
        ]


class Conversation(models.Model):
    class ConversationType(models.TextChoices):
        INDIVIDUAL = 'individual', 'Individual'
        GROUP = 'group', 'Group'

    conversation_type = models.CharField(
        max_length=12,
        choices=ConversationType.choices,
        default=ConversationType.INDIVIDUAL,
    )
    group = models.OneToOneField(
        Group,
        on_delete=models.CASCADE,
        related_name='conversation',
        null=True,
        blank=True,
    )
    last_message_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['-last_message_at'])]


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='messages_sent',
    )
    text = models.TextField(blank=True)
    media_url = models.URLField(max_length=500, blank=True)
    shared_profile_id = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', '-created_at']),
        ]
