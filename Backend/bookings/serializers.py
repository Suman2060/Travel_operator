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
        
        # Conflict checking: Travelers cannot book two packages on the same start date
        if Booking.objects.filter(user=user, travel_date=travel_date, status__in=['pending', 'confirmed']).exists():
            raise serializers.ValidationError("You already have a booking for this date.")
        
        return data
