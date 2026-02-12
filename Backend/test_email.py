
import os
import django
from django.conf import settings
from django.core.mail import send_mail

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

def test_send_email():
    print("Attempting to send email...")
    try:
        send_mail(
            'Test Subject',
            'Test Message',
            'from@example.com',
            ['to@example.com'],
            fail_silently=False,
        )
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    test_send_email()
