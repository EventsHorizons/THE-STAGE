from django.contrib import admin

from .models import Conversation, Group, GroupMember, Message


class GroupMemberInline(admin.TabularInline):
    model = GroupMember
    extra = 1


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    inlines = [GroupMemberInline]
    list_display = ('name', 'created_by', 'projects_active', 'created_at')


admin.site.register(Conversation)
admin.site.register(Message)
