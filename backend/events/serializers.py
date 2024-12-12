from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'description',
            'event_date',
            'event_time',
            'location',
            'event_type',
            'level',
            'max_participants',
            'created_by',
            'participants'
        ]
        read_only_fields = ['id', 'created_by', 'participants']
