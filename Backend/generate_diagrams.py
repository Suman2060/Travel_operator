
import base64
import requests
import os
import sys

def download_image(name, mermaid_code):
    graphbytes = mermaid_code.encode("utf8")
    base64_bytes = base64.b64encode(graphbytes)
    base64_string = base64_bytes.decode("ascii")
    
    url = "https://mermaid.ink/img/" + base64_string
    
    print(f"Downloading {name}...")
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(f"{name}.png", "wb") as f:
                f.write(response.content)
            print(f"Successfully saved {name}.png")
        else:
            print(f"Failed to download {name}. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {name}: {e}")

# ER Diagram
er_diagram = """
erDiagram
    USER ||--o{ PACKAGE : creates
    USER ||--o{ BOOKING : makes
    USER ||--o{ NOTIFICATION : receives
    PACKAGE ||--o{ ITINERARY_DAY : contains
    PACKAGE ||--o{ BOOKING : "has bookings"
    BOOKING ||--o{ NOTIFICATION : triggers
    
    USER {
        int id PK
        string role
        string username
        string email
    }
    
    PACKAGE {
        int id PK
        string title
        decimal price
        string location
        string image
    }
    
    BOOKING {
        int id PK
        date travel_date
        int num_travelers
        string status
        decimal total_price
    }

    NOTIFICATION {
        int id PK
        string type
        string title
        boolean is_read
    }
"""

# Class Diagram
class_diagram = """
classDiagram
    class User {
        +role: CharField
        +phone_number: CharField
    }
    
    class Package {
        +guide: ForeignKey
        +title: CharField
        +price: DecimalField
        +location: CharField
    }
    
    class Booking {
        +user: ForeignKey
        +package: ForeignKey
        +status: CharField
        +total_price: DecimalField
    }

    class Notification {
        +recipient: ForeignKey
        +booking: ForeignKey
        +notification_type: CharField
        +is_read: BooleanField
    }
    
    User "1" --> "0..*" Package : creates
    User "1" --> "0..*" Booking : makes
    User "1" --> "0..*" Notification : receives
    Package "1" --> "0..*" Booking : receives
    Booking "1" --> "0..*" Notification : triggers
"""

# System Architecture
arch_diagram = """
graph TB
    subgraph Frontend
        A[Landing Page]
        B[Packages Page]
        D[Booking Page]
        E[My Bookings]
        F[Guide Dashboard]
        H[Notification Bell]
    end
    
    subgraph Backend
        J[Auth API]
        K[Packages API]
        L[Bookings API]
        M[Notifications API]
    end
    
    subgraph Database
        N[(Users)]
        O[(Packages)]
        Q[(Bookings)]
        R[(Notifications)]
    end
    
    A --> J
    B --> K
    D --> L
    E --> L
    F --> K
    F --> L
    H --> M
    
    J --> N
    K --> O
    L --> Q
    L --> N
    M --> R
    M --> N
    L --> R
"""

if __name__ == "__main__":
    download_image("er_diagram", er_diagram)
    download_image("class_diagram", class_diagram)
    download_image("system_architecture", arch_diagram)
