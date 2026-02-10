from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Package, ItineraryDay
from .serializers import PackageSerializer, ItineraryDaySerializer

class IsGuideOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'guide'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.guide == request.user

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all().order_by('-created_at')
    serializer_class = PackageSerializer
    permission_classes = [IsGuideOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(guide=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsGuideOrReadOnly])
    def add_itinerary_day(self, request, pk=None):
        package = self.get_object()
        serializer = ItineraryDaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(package=package)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
