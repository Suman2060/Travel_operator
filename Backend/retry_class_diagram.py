
import base64
import requests
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

# Class Diagram (Simplified slightly to avoid timeouts if complexity is issue)
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
    
    User "1" --> "0.." Package : creates
    User "1" --> "0.." Booking : makes
    User "1" --> "0.." Notification : receives
    Package "1" --> "0.." Booking : receives
    Booking "1" --> "0.." Notification : triggers
"""

if __name__ == "__main__":
    download_image("class_diagram", class_diagram)
