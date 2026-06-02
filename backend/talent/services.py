"""
Business logic: swipe processing and mutual match detection.
"""

from django.db import transaction

from .models import Connection, Match


@transaction.atomic
def process_swipe(*, sender, receiver_id: str, action_type: str) -> dict:
    from django.contrib.auth import get_user_model

    User = get_user_model()
    receiver = User.objects.get(pk=receiver_id)

    connection, created = Connection.objects.get_or_create(
        sender=sender,
        receiver=receiver,
        action_type=action_type,
    )
    if not created:
        connection.save()  # touch updated if needed

    match = None
    is_mutual = False

    if action_type == Connection.ActionType.LIKE:
        reciprocal = Connection.objects.filter(
            sender=receiver,
            receiver=sender,
            action_type=Connection.ActionType.LIKE,
        ).exists()
        if reciprocal:
            u1, u2 = Match.normalize_pair(sender.id, receiver.id)
            match, _ = Match.objects.get_or_create(user_one_id=u1, user_two_id=u2)
            is_mutual = True

    return {
        'connection': connection,
        'match': match,
        'is_mutual': is_mutual,
    }
