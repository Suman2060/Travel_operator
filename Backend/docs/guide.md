# Backend Architecture: Antigravity System

The backend is built using:
* Django
* Django REST Framework
* JWT Authentication
* Role-based access control
* Email notifications

## 1. Lightweight Authentication
* **JWT-based authentication**: Stateless and fast.
* **Role-based access**: Distinct scopes for Travelers and Guides.

## 2. Flexible User Roles
* **Roles**: Traveler, Tour Guide.
* **Permissions**: Custom permission classes in DRF to ensure separation of concerns.

## 3. Floating Package Management
* **CRUD**: Guides can manage their packages.
* **Independence**: Packages are modular units with their own itinerary and schedule.

## 4. Smooth Booking Flow
* **Cash-on-arrival**: Simplifies the booking process (no complex payment gateway integration initially, though the prompt mentioned "Payment Processing" as a Next Step, the guide says "Cash-on-arrival" - I will stick to the guide for now but keep payment in mind for future).
* **Validation**: Automatic capacity checks.

## 5. Conflict-Free Scheduling
* **Logic**: Prevent double bookings for both travelers and guides on the same dates.

## 6. Automated Communication
* **Notifications**: Email alerts for new bookings to guides.

## 7. Modular Itinerary Structure
* **Data Model**: One-to-Many relationship between Package and ItineraryDay.

## 8. Location-Based Search
* **Filtering**: APIs to filter packages by location, price, and duration.
