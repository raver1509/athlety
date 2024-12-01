import django_filters
from .models import CustomUser


class UserProfileFilter(django_filters.FilterSet):
    age = django_filters.RangeFilter()
    location = django_filters.CharFilter(lookup_expr='icontains')
    preferred_sports = django_filters.ChoiceFilter(choices=CustomUser.PreferredSports.choices)
    level = django_filters.ChoiceFilter(choices=CustomUser.Level.choices)

    class Meta:
        model = CustomUser
        fields = ['age', 'location', 'preferred_sports', 'level']
