from django.contrib import admin
from .models import Package, ItineraryDay

class ItineraryDayInline(admin.StackedInline):
    model = ItineraryDay
    extra = 1

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'price', 'duration', 'guide']
    list_filter = ['location', 'guide']
    search_fields = ['title', 'description', 'location']
    inlines = [ItineraryDayInline]

@admin.register(ItineraryDay)
class ItineraryDayAdmin(admin.ModelAdmin):
    list_display = ['package', 'day_number', 'title']
    list_filter = ['package']
