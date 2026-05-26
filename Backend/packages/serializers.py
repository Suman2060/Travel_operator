from rest_framework import serializers
from .models import Package, ItineraryDay
import json

class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = ('id', 'day_number', 'title', 'description')
        read_only_fields = ('id',)

class PackageSerializer(serializers.ModelSerializer):
    itinerary_days = ItineraryDaySerializer(many=True)
    guide_name = serializers.CharField(source='guide.username', read_only=True)
    guide_phone = serializers.CharField(source='guide.phone_number', read_only=True)

    class Meta:
        model = Package
        fields = ('id', 'title', 'description', 'price', 'duration', 'location', 'image', 'max_travelers', 'guide', 'guide_name', 'guide_phone', 'itinerary_days', 'created_at')
        read_only_fields = ('guide', 'created_at')

    def to_internal_value(self, data):
        # When using FormData, data is a QueryDict which is immutable.
        # We convert it to a dict to handle nested JSON strings.
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = data.copy()

        if 'itinerary_days' in data and isinstance(data['itinerary_days'], str):
            try:
                data['itinerary_days'] = json.loads(data['itinerary_days'])
            except (ValueError, TypeError):
                pass
        return super().to_internal_value(data)

    def create(self, validated_data):
        itinerary_data = validated_data.pop('itinerary_days', [])
        package = Package.objects.create(**validated_data)
        for day in itinerary_data:
            day.pop('id', None)
            ItineraryDay.objects.create(package=package, **day)
        return package

    def update(self, instance, validated_data):
        itinerary_data = validated_data.pop('itinerary_days', None)

        # Update package fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update itinerary: clear all existing days and recreate from submitted data
        if itinerary_data is not None:
            instance.itinerary_days.all().delete()
            for day in itinerary_data:
                # Strip any incoming 'id' so Django creates fresh records
                day.pop('id', None)
                ItineraryDay.objects.create(package=instance, **day)

        return instance
