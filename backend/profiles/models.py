from django.db import models
from django.conf import settings

class ExperienceLevel(models.TextChoices):
    BEGINNER = 'BEGINNER', 'Beginner'
    INTERMEDIATE = 'INTERMEDIATE', 'Intermediate'
    ADVANCED = 'ADVANCED', 'Advanced'

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    username = models.CharField(max_length=100, unique=True)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices)
    age = models.PositiveIntegerField()
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.username
