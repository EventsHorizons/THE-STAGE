from rest_framework import serializers

from .models import Conversation, Group, GroupMember, Message


class GroupMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id')

    class Meta:
        model = GroupMember
        fields = ('id', 'group_id', 'user_id', 'role')


class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.IntegerField(source='created_by.id', read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = (
            'id',
            'name',
            'description',
            'created_by',
            'avatar_url',
            'projects_active',
            'created_at',
        )

    def get_avatar_url(self, obj: Group) -> str | None:
        if not obj.avatar:
            return None
        request = self.context.get('request')
        url = obj.avatar.url
        return request.build_absolute_uri(url) if request and url.startswith('/') else url


class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id')

    class Meta:
        model = Message
        fields = (
            'id',
            'conversation_id',
            'sender_id',
            'text',
            'media_url',
            'shared_profile_id',
            'created_at',
        )


class ConversationSerializer(serializers.ModelSerializer):
    associated_group_id = serializers.IntegerField(source='group_id', allow_null=True)

    class Meta:
        model = Conversation
        fields = ('id', 'type', 'associated_group_id', 'last_message_at')

    type = serializers.CharField(source='conversation_type')
