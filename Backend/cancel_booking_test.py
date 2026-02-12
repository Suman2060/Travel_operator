
import requests
import datetime
import sys

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
        if hasattr(e, 'response') and e.response:
            print(e.response.text)
        return None

def create_booking_to_cancel(token, package_id):
    print(f"--- Creating a booking to cancel (Package {package_id}) ---")
    headers = {'Authorization': f'Bearer {token}'}
    
    # Use a random date to avoid conflicts
    import random
    days_offset = 50 + random.randint(1, 200)
    travel_date = (datetime.date.today() + datetime.timedelta(days=days_offset)).isoformat()
    
    data = {
        'package': package_id,
        'travel_date': travel_date,
        'num_travelers': 1
    }
    
    try:
        response = requests.post(f'{BASE_URL}/bookings/', headers=headers, json=data)
        response.raise_for_status()
        print("Booking created successfully!")
        return response.json()['id']
    except Exception as e:
        print(f"Failed to create booking: {e}")
        if hasattr(e, 'response') and e.response:
            print(e.response.text)
        return None

def cancel_booking(token, booking_id):
    print(f"--- Cancelling booking {booking_id} ---")
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.delete(f'{BASE_URL}/bookings/{booking_id}/', headers=headers)
        if response.status_code == 204:
            print("Booking cancelled successfully! (Status 204)")
            return True
        else:
            print(f"Unexpected status code: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"Failed to cancel booking: {e}")
        return False

if __name__ == "__main__":
    token = get_token()
    if token:
        # Use package 5 (assumed to exist from previous tests)
        booking_id = create_booking_to_cancel(token, 5)
        if booking_id:
            cancel_booking(token, booking_id)
