# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    class PreferredSports(models.TextChoices):
        CYCLING = 'cycling', _('Cycling')
        SWIMMING = 'swimming', _('Swimming')
        RUNNING = 'running', _('Running')

    class Level(models.TextChoices):
        BEGINNER = 'beginner', _('Beginner')
        INTERMEDIATE = 'intermediate', _('Intermediate')
        ADVANCED = 'advanced', _('Advanced')

    email = models.EmailField(_('email address'), unique=True)  # Ensure email is unique

    # Additional fields for user profile
    level = models.CharField(
        max_length=15,
        choices=Level.choices,
        null=True,
        blank=True,
    )
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    preferred_sports = models.CharField(
        max_length=10,
        choices=PreferredSports.choices,
        null=True,
        blank=True,
    )
    location = models.CharField(max_length=100, null=True, blank=True)

    friends = models.ManyToManyField("CustomUser", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


class Friend_Request(models.Model):
    from_user = models.ForeignKey(
        CustomUser, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        CustomUser, related_name='to_user', on_delete=models.CASCADE
    )
