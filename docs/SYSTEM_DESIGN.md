# Chill Travel: System Documentation

This document provides detailed technical documentation for the **Chill Travel** platform, including data modeling and process modeling.

---

## 1. Data Modeling

### A. Conceptual Design
The conceptual model identifies high-level entities and their relationships without technical detail.
- **Entities**: User (Guide, Traveler), Package, Itinerary Day, Booking.
- **Relationships**:
  - A **Guide** creates multiple **Packages**.
  - A **Package** consists of one or more **Itinerary Days**.
  - A **Traveler** makes multiple **Bookings**.
  - A **Booking** links a **Traveler** to a **Package**.

---

### B. Logical Design (ER Diagram)
The Entity-Relationship Diagram (ERD) shows the database structure, fields, and relationships.

```mermaid
erDiagram
    USER ||--o{ PACKAGE : "creates"
    USER ||--o{ BOOKING : "makes"
    PACKAGE ||--o{ ITINERARY_DAY : "contains"
    PACKAGE ||--o{ BOOKING : "is booked"

    USER {
        int id PK
        string username
        string email
        string password
        string role "traveler | guide"
        string phone_number
    }

    PACKAGE {
        int id PK
        int guide_id FK
        string title
        text description
        decimal price
        string duration
        string location
        string image
        int max_travelers
        timestamp created_at
    }

    ITINERARY_DAY {
        int id PK
        int package_id FK
        int day_number
        string title
        text description
    }

    BOOKING {
        int id PK
        int user_id FK
        int package_id FK
        date travel_date
        int num_travelers
        string status "pending | confirmed | cancelled"
        decimal total_price
        timestamp created_at
    }
```

---

### C. Physical Design
Detailed database schema definition.

| Table Name | Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| **users_user** | id | INTEGER | PK, AUTO | Primary Key |
| | username | VARCHAR(150) | UNIQUE, NOT NULL | Login ID |
| | email | VARCHAR(254) | NOT NULL | User Email |
| | role | VARCHAR(10) | NOT NULL | 'traveler' or 'guide' |
| **packages_package** | id | INTEGER | PK, AUTO | Primary Key |
| | guide_id | INTEGER | FK (users_user), NOT NULL | Link to Guide |
| | title | VARCHAR(255) | NOT NULL | Package Name |
| | price | DECIMAL(10,2) | NOT NULL | Base Price |
| **packages_itineraryday**| id | INTEGER | PK, AUTO | Primary Key |
| | package_id | INTEGER | FK (packages_package), NOT NULL | Link to Package |
| | day_number | INTEGER | NOT NULL | Sequence of day |
| **bookings_booking** | id | INTEGER | PK, AUTO | Primary Key |
| | user_id | INTEGER | FK (users_user), NOT NULL | Link to Traveler |
| | package_id | INTEGER | FK (packages_package), NOT NULL | Link to Package |
| | total_price | DECIMAL(10,2) | NOT NULL | Total Cost |

---

## 2. Process Modeling

### A. Object Oriented (UML Diagrams)

#### i. Class Diagram
Focuses on the relationships between Backend components (Models, Serializers, Views).

```mermaid
classDiagram
    class User {
        +String username
        +String role
        +get_packages()
        +get_bookings()
    }
    class Package {
        +String title
        +Decimal price
        +get_itinerary()
    }
    class Booking {
        +Date travel_date
        +int num_travelers
        +calculate_total()
    }
    class PackageViewSet {
        +list()
        +create()
        +retrieve()
    }
    class BookingViewSet {
        +create()
        +get_queryset()
    }

    User "1" --> "*" Package : manages
    User "1" --> "*" Booking : performs
    Package "1" --> "*" Booking : receives
    Package "1" --> "*" ItineraryDay : includes
    
    PackageViewSet ..> Package : uses
    BookingViewSet ..> Booking : uses
```

#### ii. Sequence Diagram (Booking Process)
Describes how objects interact to complete a booking.

```mermaid
sequenceDiagram
    participant Traveler as Traveler (Frontend)
    participant API as BookingViewSet (Backend)
    participant Model as Booking/Package (Django)
    participant DB as Database (SQLite/Postgres)

    Traveler->>API: POST /api/bookings/ (PackageID, Date, Travelers)
    API->>Model: Validate Package & Calculate Price
    Model-->>API: Total Price Calculated
    API->>DB: Save Booking Record
    DB-->>API: Success
    API-->>Traveler: 201 Created (Booking Details)
```

#### iii. Component Diagram
Shows the structural organization of the system components.

```mermaid
componentDiagram
    [Client-side (React)] as React
    [Server-side (Django REST Framework)] as DRF
    [Database (Relational)] as DB
    [Cloud Storage (Media/Images)] as Storage

    React --( HTTP/REST : JSON
    DRF --( SQL : Queries
    DRF -- Storage : Uploads
```

---

### B. Structured Modeling (Data Flow Diagrams)

#### i. Data Flow Diagram (Level 1)
Overall data flow between processes and entities.

```mermaid
graph LR
    User((User)) -- Req: Package Info --> System[Chill Travel System]
    System -- Res: Package List --> User
    User -- Action: Book Trip --> System
    System -- Update: Reservation --> DataStore[(Database)]
    DataStore -- Data: Package/User Info --> System
```

#### ii. Data Flow Diagram (Level 2 - Booking Process)
Detailed breakdown of the booking process.

```mermaid
graph TD
    User((Traveler)) -- 1. Submit Booking --> B1[Validate Session/Token]
    B1 -- Valid --> B2[Calculate Costs]
    B2 -- Pricing Meta --> B3[Check Availability]
    B3 -- Available --> B4[Save Booking to DB]
    B4 --> DB[(Database)]
    B4 -- 2. Success Signal --> User
```
