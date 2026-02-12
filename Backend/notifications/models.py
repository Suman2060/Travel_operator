from django.db import models
from django.conf import settings
from bookings.models import Booking


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('booking_request', 'New Booking Request'),
        ('booking_confirmed', 'Booking Confirmed'),
        ('booking_rejected', 'Booking Rejected'),
        ('booking_cancelled', 'Booking Cancelled'),
    )
    
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.recipient.username} - {self.get_notification_type_display()}"
