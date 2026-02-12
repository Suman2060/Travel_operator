import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("USER EMAIL ADDRESSES IN DATABASE")
print("=" * 60)

users = User.objects.all()
for user in users:
    print(f"\nUsername: {user.username}")
    print(f"Email: {user.email}")
    print(f"Role: {user.role}")
    print("-" * 40)

print(f"\nTotal users: {users.count()}")
