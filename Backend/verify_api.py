import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def verify_api():
    # 1. Register a Guide
    print("--- 1. Registering Guide ---")
    register_data = {
        "username": "test_guide",
        "email": "guide@test.com",
        "password": "password123",
        "role": "guide"
    }
    resp = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
    print(f"Register Status: {resp.status_code}")
    print(resp.json())

    # 2. Login
    print("\n--- 2. Logging In ---")
    login_data = {
        "username": "test_guide",
        "password": "password123"
    }
    resp = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    print(f"Login Status: {resp.status_code}")
    tokens = resp.json()
    access_token = tokens['access']

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # 3. Create a Package
    print("\n--- 3. Creating Package ---")
    package_data = {
        "title": "Mt. Everest Base Camp",
        "description": "High altitude trekking in the Himalayas.",
        "price": "1500.00",
        "duration": "12 Days",
        "location": "Solu-Khumbu, Nepal"
    }
    resp = requests.post(f"{BASE_URL}/packages/", json=package_data, headers=headers)
    print(f"Create Package Status: {resp.status_code}")
    package = resp.json()
    print(package)
    package_id = package['id']

    # 4. Add Itinerary Day
    print("\n--- 4. Adding Itinerary Day ---")
    day_data = {
        "day_number": 1,
        "title": "Arrival in Kathmandu",
        "description": "Welcome dinner and orientation."
    }
    resp = requests.post(f"{BASE_URL}/packages/{package_id}/add_itinerary_day/", json=day_data, headers=headers)
    print(f"Add Day Status: {resp.status_code}")
    print(resp.json())

    # 5. Get Packages (Public)
    print("\n--- 5. Getting Packages (Public) ---")
    resp = requests.get(f"{BASE_URL}/packages/")
    print(f"Get Packages Status: {resp.status_code}")
    print(resp.json())

if __name__ == "__main__":
    try:
        verify_api()
    except Exception as e:
        print(f"Error: {e}")
