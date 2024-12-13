from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from datetime import date, datetime, time

class Event(models.Model):
    class EventType(models.TextChoices):
        CYCLING = 'cycling', _('Cycling')
        RUNNING = 'running', _('Running')
        OTHER = 'other', _('Other')

    class Level(models.TextChoices):
        BEGINNER = 'beginner', _('Beginner')
        INTERMEDIATE = 'intermediate', _('Intermediate')
        ADVANCED = 'advanced', _('Advanced')
        ANY = 'any', _('Any')

    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    event_date = models.DateField(default=date.today)
    event_time = models.TimeField(default=time(0, 0))
    location = models.CharField(max_length=255)
    event_type = models.CharField(
        max_length=10,
        choices=EventType.choices
    )
    level = models.CharField(
        max_length=15,
        choices=Level.choices,
        default=Level.BEGINNER
    )
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_events'
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_events',
        blank=True
    )

    # def clean(self):
    #     if self.event_date < date.today():
    #         raise ValidationError({'event_date': 'The event date cannot be in the past.'})
    #
    #     if self.event_date == date.today() and self.event_time < datetime.now().time():
    #         raise ValidationError({'event_time': 'The event time cannot be in the past.'})

    def __str__(self):
        return self.name
