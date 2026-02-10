from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'guide':
            # Guides see bookings for their packages
            return Booking.objects.filter(package__guide=user).order_by('-created_at')
        # Travelers see their own bookings
        return Booking.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        package = serializer.validated_data['package']
        num_travelers = serializer.validated_data['num_travelers']
        total_price = package.price * num_travelers
        
        booking = serializer.save(
            user=self.request.user,
            total_price=total_price,
            status='confirmed' # Simple flow: confirmed immediately
        )
        
        # Simulated email notification
        print(f"DEBUG: Sending email to guide ({package.guide.email})...")
        print(f"DEBUG: New booking for '{package.title}' by {self.request.user.username} for {booking.travel_date}.")
