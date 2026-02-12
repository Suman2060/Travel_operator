
import requests
import sys
import datetime

# Constants
BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{BASE_URL}/auth/login/'
BOOKINGS_URL = f'{BASE_URL}/bookings/'

def get_token(username, password):
    response = requests.post(LOGIN_URL, json={'username': username, 'password': password})
    if response.status_code == 200:
        return response.json()['access']
    else:
        print(f"Failed to login: {response.text}")
        return None

def create_booking(token, package_id, travelers):
    print(f"--- Attempting to create booking for package {package_id} ---")
    headers = {'Authorization': f'Bearer {token}'}
    # Use a date further in future + random component to avoid collisions during testing
    import random
    days_offset = 10 + random.randint(1, 100)
    travel_date = (datetime.date.today() + datetime.timedelta(days=days_offset)).isoformat()
    
    data = {
        'package': package_id,
        'travel_date': travel_date,
        'num_travelers': travelers
    }
    
    response = requests.post(BOOKINGS_URL, json=data, headers=headers)
    if response.status_code == 201:
        print("Booking created successfully!")
        print(response.json())
    else:
        print(f"Failed to create booking: {response.text}")

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python create_booking.py <username> <password> <package_id> <num_travelers>")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    package_id = sys.argv[3]
    num_travelers = sys.argv[4]
    
    token = get_token(username, password)
    if token:
        create_booking(token, package_id, num_travelers)
