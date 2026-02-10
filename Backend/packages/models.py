from django.db import models
from django.conf import settings

class Package(models.Model):
    guide = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='packages')
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50) # e.g., "5 Days"
    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to='packages/', blank=True, null=True)
    max_travelers = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ItineraryDay(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='itinerary_days')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        ordering = ['day_number']
        unique_together = ['package', 'day_number']

    def __str__(self):
        return f"{self.package.title} - Day {self.day_number}"
