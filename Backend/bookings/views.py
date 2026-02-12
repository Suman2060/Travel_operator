from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Booking
from .serializers import BookingSerializer
from notifications.models import Notification
import logging

logger = logging.getLogger(__name__)

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
        user = self.request.user
        if user.role == 'guide':
            raise permissions.PermissionDenied("Professional Guides cannot book trips. Please use a traveler account.")

        package = serializer.validated_data['package']
        num_travelers = serializer.validated_data['num_travelers']
        total_price = package.price * num_travelers
        
        # Create booking with pending status
        booking = serializer.save(
            user=user,
            total_price=total_price,
            status='pending'
        )
        
        # Create notification for guide
        Notification.objects.create(
            recipient=package.guide,
            notification_type='booking_request',
            title='New Booking Request',
            message=f'{user.username} has requested to book "{package.title}" for {booking.travel_date}. {num_travelers} traveler(s), Total: Rs. {total_price}',
            booking=booking
        )
        
        print(f"Booking {booking.id} created with pending status. Guide notification created.", flush=True)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve(self, request, pk=None):
        """Guide approves a pending booking"""
        booking = self.get_object()
        
        # Only guide can approve
        if request.user != booking.package.guide:
            return Response(
                {'error': 'Only the package guide can approve bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if booking.status != 'pending':
            return Response(
                {'error': 'Only pending bookings can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update booking status
        booking.status = 'confirmed'
        booking.save()
        
        # Create notification for traveler
        Notification.objects.create(
            recipient=booking.user,
            notification_type='booking_confirmed',
            title='Booking Confirmed',
            message=f'Your booking for "{booking.package.title}" on {booking.travel_date} has been confirmed by the guide.',
            booking=booking
        )
        
        return Response({'status': 'booking approved'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        """Guide rejects a pending booking"""
        booking = self.get_object()
        
        # Only guide can reject
        if request.user != booking.package.guide:
            return Response(
                {'error': 'Only the package guide can reject bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if booking.status != 'pending':
            return Response(
                {'error': 'Only pending bookings can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update booking status
        booking.status = 'rejected'
        booking.save()
        
        # Create notification for traveler
        Notification.objects.create(
            recipient=booking.user,
            notification_type='booking_rejected',
            title='Booking Request Declined',
            message=f'Your booking request for "{booking.package.title}" on {booking.travel_date} was declined by the guide.',
            booking=booking
        )
        
        return Response({'status': 'booking rejected'})

    def perform_destroy(self, instance):
        """Handle booking cancellation"""
        print(f"Processing cancellation for booking {instance.id}...", flush=True)
        
        # Create notification for guide
        Notification.objects.create(
            recipient=instance.package.guide,
            notification_type='booking_cancelled',
            title='Booking Cancelled',
            message=f'{instance.user.username} cancelled their booking for "{instance.package.title}" on {instance.travel_date}.',
            booking=None  # Booking will be deleted
        )
        
        instance.delete()
