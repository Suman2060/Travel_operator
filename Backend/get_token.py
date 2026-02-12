
import requests
import sys

# Constants
BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{BASE_URL}/auth/login/'

def get_token(username, password):
    response = requests.post(LOGIN_URL, json={'username': username, 'password': password})
    if response.status_code == 200:
        return response.json()['access']
    else:
        print(f"Failed to login: {response.text}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python get_token.py <username> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    
    token = get_token(username, password)
    if token:
        print(token)
