# Chill Travel: Project Architecture & Code Explanation

This document provides a comprehensive breakdown of the **Chill Travel** platform, covering the technology stack, database architecture, and core business logic.

---

## 1. Project Overview
**Chill Travel** is a Full-Stack Tour Operator System designed for two primary user roles:
- **Travelers**: Browse unique journeys, view detailed itineraries, and book trips.
- **Guides**: Create and manage tour packages, build day-by-day itineraries, and monitor traveler bookings.

---

## 2. Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion (Animations), Axios (API calls).
- **Backend**: Django, Django REST Framework (DRF).
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`.

---

## 3. Database Architecture (The "Brain")

### **A. Users (`users` app)**
Uses a custom Django User model that adds a `role` field.
- **Roles**: `traveler` or `guide`.
- **Logic**: Permissions throughout the app check this role to allow or block actions.

### **B. Packages (`packages` app)**
The heart of the system.
- **Package Model**: Stores Title, Description, Price, Duration, and Location.
- **ItineraryDay Model**: A "Child" model linked to a Package. Each package can have multiple days, each with a title and description.
- **Nested Serialization**: When you fetch a package, the backend automatically sends all its itinerary days in one block of data.

### **C. Bookings (`bookings` app)**
Handles the transaction between users and packages.
- **Fields**: User (who booked), Package (what trip), Travel Date, Number of Travelers, Total Price, and Status (`confirmed`, `pending`).
- **Conflict Logic**: A traveler cannot book two different packages on the exact same date.

---

## 4. Key Code Highlights

### **🔐 Authentication (`AuthContext.jsx`)**
Located in `src/context/AuthContext.jsx`, this manages the global state.
- **Persistence**: Tokens are stored in `localStorage` so you stay logged in after a refresh.
- **Interceptors**: In `src/lib/api.js`, every request automatically "grabs" the token and puts it in the `Authorization` header so the backend knows who is calling.

### **🛠️ Guide Dashboard (`GuideDashboard.jsx`)**
A specialized interface for Guides.
- **Logic**: It fetches both the list of trips the guide created and the bookings travelers made for those trips.
- **State Management**: Uses tabs to switch between "Active Bookings" and "My Packages" without reloading the page.

### **📦 Package Creation (`CreatePackage.jsx`)**
- **Dynamic UI**: Uses a state array for itineraries, allowing guides to "Add Day" or "Remove Day" dynamically.
- **Nested Write**: The frontend sends a single JSON object containing both the package details AND the itinerary array. The backend's `PackageSerializer.create()` method then splits this data and saves it into two separate tables automatically.

### **📅 Booking System (`Booking.jsx`)**
- **Multi-step Form**: Breaks the booking into "Trip Details", "Travelers", and "Payment".
- **Dynamic Summary**: Calculates total price (USD and NPR) in real-time as the number of travelers changes.

---

## 5. Directory Structure
```text
/Backend
  /travel_backend      # Main configuration (settings, master URLs)
  /users               # User models & Registration logic
  /packages            # Trip listings & Itinerary logic
  /bookings            # Reservation & Conflict handling logic
/Frontend
  /src
    /components        # Reusable UI parts (Navbar, Cards)
    /context           # AuthContext (The "Global Presence")
    /lib               # API config and Currency helpers
    /pages             # Main views (Landing, Dashboard, Booking)
```

---

## 6. Data Flow: How it works together
1. **Request**: A Traveler clicks "Book" in the React Frontend.
2. **API**: The frontend sends a `POST` request to `/api/bookings/` with the JWT token.
3. **Backend Validation**:
   - Checks if the user is logged in.
   - Calculates `Total Price` (Price * Travelers).
   - Checks for date conflicts.
4. **Response**: Backend saves to Database and sends a `201 Created` status back to the frontend.
5. **Update**: Frontend shows a "Success" message and the Guide's dashboard updates instantly in their next poll.

---

**This project follows a "Clean Architecture" pattern where logic is decoupled, making it easy to scale or add features like real payment gateways in the future.**
