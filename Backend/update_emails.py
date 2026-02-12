import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("UPDATING USER EMAIL ADDRESSES")
print("=" * 60)

# Update traveler_email_test to use your real email
traveler = User.objects.get(username='traveler_email_test')
old_email = traveler.email
traveler.email = 'sumandangol2060@gmail.com'  # Your real email
traveler.save()

print(f"\n✅ Updated traveler_email_test:")
print(f"   Old: {old_email}")
print(f"   New: {traveler.email}")

# Show Guide2 email (who owns package 5)
guide = User.objects.get(username='Guide2')
print(f"\n✅ Package 5 guide (Guide2):")
print(f"   Email: {guide.email}")

print("\n" + "=" * 60)
print("NOW WHEN YOU BOOK:")
print(f"- Traveler email will go to: {traveler.email}")
print(f"- Guide email will go to: {guide.email}")
print("=" * 60)
