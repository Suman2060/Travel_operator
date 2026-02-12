from rest_framework import serializers
from .models import Booking
from packages.serializers import PackageSerializer

class BookingSerializer(serializers.ModelSerializer):
    package_details = PackageSerializer(source='package', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'user', 'user_name', 'package', 'package_details', 'travel_date', 'num_travelers', 'status', 'total_price', 'created_at')
        read_only_fields = ('user', 'total_price', 'status', 'created_at')

    def validate(self, data):
        user = self.context['request'].user
        travel_date = data['travel_date']
        package = data['package']
        
        # Check 1: Is this package already booked for this date?
        # (Only one tour group per package per day)
        existing_package_booking = Booking.objects.filter(
            package=package,
            travel_date=travel_date,
            status__in=['pending', 'confirmed']
        ).exists()
        
        if existing_package_booking:
            raise serializers.ValidationError(
                f"This package is already booked for {travel_date.strftime('%B %d, %Y')}. Please choose a different date."
            )
        
        # Check 2: Does this user already have a booking for this date?
        # (Users can only book one trip per day)
        existing_user_booking = Booking.objects.filter(
            user=user,
            travel_date=travel_date,
            status__in=['pending', 'confirmed']
        ).exists()
        
        if existing_user_booking:
            raise serializers.ValidationError(
                f"You already have a booking on {travel_date.strftime('%B %d, %Y')}. You can only book one trip per day."
            )
        
        return data
