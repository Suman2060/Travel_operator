import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def verify_bookings():
    # 1. Register a Traveler
    print("--- 1. Registering Traveler ---")
    register_data = {
        "username": "test_traveler",
        "email": "traveler@test.com",
        "password": "password123",
        "role": "traveler"
    }
    resp = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
    print(f"Register Status: {resp.status_code}")

    # 2. Login
    print("\n--- 2. Logging In ---")
    login_data = {
        "username": "test_traveler",
        "password": "password123"
    }
    resp = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    tokens = resp.json()
    access_token = tokens['access']
    headers = {"Authorization": f"Bearer {access_token}"}

    # 3. Get Package ID
    print("\n--- 3. Fetching Package ---")
    resp = requests.get(f"{BASE_URL}/packages/")
    package_id = resp.json()[0]['id']
    print(f"Found Package ID: {package_id}")

    # 4. Create Booking
    print("\n--- 4. Creating Booking ---")
    booking_data = {
        "package": package_id,
        "travel_date": "2026-10-12",
        "num_travelers": 2
    }
    resp = requests.post(f"{BASE_URL}/bookings/", json=booking_data, headers=headers)
    print(f"Booking Status: {resp.status_code}")
    print(resp.json())

    # 5. Create Conflict Booking (Same Date)
    print("\n--- 5. Testing Conflict Booking (Same Date) ---")
    resp = requests.post(f"{BASE_URL}/bookings/", json=booking_data, headers=headers)
    print(f"Conflict Booking Status: {resp.status_code}")
    print(resp.json())

    # 6. View My Bookings
    print("\n--- 6. Viewing My Bookings ---")
    resp = requests.get(f"{BASE_URL}/bookings/", headers=headers)
    print(f"Get Bookings Status: {resp.status_code}")
    print(f"Number of bookings: {len(resp.json())}")

if __name__ == "__main__":
    try:
        verify_bookings()
    except Exception as e:
        print(f"Error: {e}")
