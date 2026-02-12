"""
Check if emails were actually sent by Django
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("=" * 60)
print("DJANGO EMAIL CONFIGURATION CHECK")
print("=" * 60)
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"EMAIL_HOST_PASSWORD: {'*' * 10} (hidden)")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print("=" * 60)

print("\nSending test email via Django send_mail()...")

try:
    result = send_mail(
        subject='🧪 Django Email Test',
        message='If you see this, Django email is working!',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['sumandangol2060@gmail.com'],
        fail_silently=False,
    )
    
    print(f"\n✅ send_mail() returned: {result}")
    print(f"   (1 = success, 0 = failure)")
    
    if result == 1:
        print("\n📧 Email sent successfully via Django!")
        print("Check your inbox at sumandangol2060@gmail.com")
    else:
        print("\n❌ send_mail() returned 0 - email was NOT sent")
        
except Exception as e:
    print(f"\n❌ ERROR sending email: {e}")
    import traceback
    traceback.print_exc()
