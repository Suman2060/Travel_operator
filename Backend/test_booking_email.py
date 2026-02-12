import requests
import datetime
import sys
import random

# Configuration
BASE_URL = 'http://127.0.0.1:8000/api'
USERNAME = 'traveler_email_test'
PASSWORD = 'password123'

def get_token():
    print(f"Authenticating as {USERNAME}...")
    try:
        response = requests.post(f'{BASE_URL}/auth/login/', data={
            'username': USERNAME,
            'password': PASSWORD
        })
        response.raise_for_status()
        return response.json()['access']
    except Exception as e:
        print(f"Authentication failed: {e}")
        return None

def create_booking(token, package_id):
    # Use a random future date to avoid conflicts
    days_offset = 100 + random.randint(1, 200)
    travel_date = (datetime.date.today() + datetime.timedelta(days=days_offset)).isoformat()
    
    print(f"--- Attempting to create booking for package {package_id} on {travel_date} ---")
    
    headers = {'Authorization': f'Bearer {token}'}
    data = {
        'package': package_id,
        'travel_date': travel_date,
        'num_travelers': 1
    }
    
    try:
        response = requests.post(f'{BASE_URL}/bookings/', headers=headers, json=data)
        response.raise_for_status()
        booking = response.json()
        print("\n✅ Booking created successfully!")
        print(f"Booking ID: {booking['id']}")
        print(f"Travel Date: {booking['travel_date']}")
        print(f"Total Price: Rs. {booking['total_price']}")
        print("\n📧 Check your email at sumandangol2060@gmail.com")
        print("You should receive 2 emails:")
        print("  1. Guide notification")
        print("  2. Traveler confirmation")
        return booking
    except Exception as e:
        print(f"\n❌ Failed to create booking: {e}")
        if hasattr(e, 'response') and e.response:
            print(e.response.text)
        return None

if __name__ == "__main__":
    token = get_token()
    if token:
        create_booking(token, 5)
