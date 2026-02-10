from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'package', 'travel_date', 'num_travelers', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'travel_date', 'created_at']
    search_fields = ['user__username', 'package__title']
    ordering = ['-created_at']
