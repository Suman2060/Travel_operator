# Email Notification System - Setup Guide

## Overview
The Chill Travel system now has a **fully functional email notification system** that automatically sends detailed booking information to guides when travelers book their packages.

---

## 🎯 What Gets Sent in the Email

When a traveler books a package, the guide receives a **beautifully formatted HTML email** containing:

### 📦 Package Information
- Package name
- Location
- Duration
- Price per person

### 👤 Traveler Information
- Name (username)
- Email address
- Phone number (if provided)

### 📅 Booking Details
- Travel date
- Number of travelers
- Total price
- Booking status
- Booking ID
- Timestamp when booking was created

---

## ⚙️ Configuration Options

### Option 1: Console Backend (Current - Development Mode)
**Status:** ✅ Currently Active

This mode prints emails to the **terminal/console** instead of actually sending them. Perfect for development and testing.

**Configuration in `settings.py`:**
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'Chill Travel <noreply@chilltravel.com>'
```

**How to test:**
1. Run your Django server
2. Create a booking through the frontend
3. Check the terminal where Django is running
4. You'll see the full email content printed there

---

### Option 2: SMTP Backend (Production Mode)
**Status:** ⏸️ Ready to activate when needed

This mode sends **real emails** using an SMTP server (like Gmail, SendGrid, etc.).

#### Using Gmail SMTP

**Step 1: Get Gmail App Password**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate an app password for "Mail"
5. Copy the 16-character password

**Step 2: Update `settings.py`**
Comment out the console backend and uncomment the SMTP configuration:

```python
# Option 1: Console Backend (for development/testing)
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Option 2: SMTP Backend (for production)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'  # Your Gmail address
EMAIL_HOST_PASSWORD = 'your-app-password'  # The 16-char app password
DEFAULT_FROM_EMAIL = 'Chill Travel <your-email@gmail.com>'
```

**Step 3: (Recommended) Use Environment Variables**
For security, use environment variables instead of hardcoding credentials:

```python
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'your-email@gmail.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', 'your-app-password')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'Chill Travel <noreply@chilltravel.com>')
```

Then set environment variables:
```bash
# Windows (PowerShell)
$env:EMAIL_HOST_USER="your-email@gmail.com"
$env:EMAIL_HOST_PASSWORD="your-app-password"

# Windows (Command Prompt)
set EMAIL_HOST_USER=your-email@gmail.com
set EMAIL_HOST_PASSWORD=your-app-password
```

---

## 🧪 Testing the Email System

### Test with Console Backend (Current Setup)

1. **Start the Django server:**
   ```bash
   cd Backend
   python manage.py runserver
   ```

2. **Create a test booking:**
   - Use the frontend to book a package
   - OR use the API directly (Postman/curl)

3. **Check the terminal:**
   - You should see the full email content printed
   - Look for lines starting with "Content-Type: text/html"

### Test with SMTP Backend (Real Emails)

1. **Configure SMTP settings** (see Option 2 above)

2. **Ensure the guide has a valid email:**
   ```python
   # In Django shell or admin panel
   python manage.py shell
   >>> from users.models import User
   >>> guide = User.objects.get(username='your-guide-username')
   >>> guide.email = 'guide@example.com'
   >>> guide.save()
   ```

3. **Create a booking and check the guide's inbox**

---

## 📧 Email Template Preview

The email includes:
- ✅ Professional HTML formatting
- ✅ Color-coded sections for easy reading
- ✅ Responsive design
- ✅ Plain text fallback for email clients that don't support HTML
- ✅ All booking and traveler details
- ✅ Action prompts for the guide

---

## 🔧 Customization

### Change Email Template
Edit `travel_backend/email_utils.py` to customize:
- Email subject line
- HTML styling and layout
- Content sections
- Colors and branding

### Change Sender Name
Update in `settings.py`:
```python
DEFAULT_FROM_EMAIL = 'Your Company Name <noreply@yourcompany.com>'
```

### Add More Email Types
You can create additional email functions in `email_utils.py`:
- Booking confirmation to travelers
- Cancellation notifications
- Reminder emails
- Payment confirmations

---

## 🐛 Troubleshooting

### Email not appearing in console
- ✅ Check that `EMAIL_BACKEND` is set to console backend
- ✅ Ensure you're looking at the correct terminal window
- ✅ Check for errors in the Django logs

### SMTP emails not sending
- ✅ Verify Gmail app password is correct
- ✅ Check that 2FA is enabled on your Google account
- ✅ Ensure `EMAIL_USE_TLS = True` and `EMAIL_PORT = 587`
- ✅ Check firewall/antivirus isn't blocking SMTP
- ✅ Look for error messages in Django terminal

### Email going to spam
- ✅ Use a professional "from" address
- ✅ Consider using a dedicated email service (SendGrid, Mailgun)
- ✅ Add SPF/DKIM records if using custom domain

---

## 🚀 Alternative Email Services

Instead of Gmail, you can use:

### SendGrid
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = 'your-sendgrid-api-key'
```

### Mailgun
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'postmaster@your-domain.mailgun.org'
EMAIL_HOST_PASSWORD = 'your-mailgun-password'
```

---

## 📝 Code Files Modified

1. **`travel_backend/email_utils.py`** (NEW)
   - Email sending utility function
   - HTML email template
   - Plain text fallback

2. **`travel_backend/settings.py`**
   - Email backend configuration
   - SMTP settings (commented for production)

3. **`bookings/views.py`**
   - Integrated email sending on booking creation
   - Added success/failure logging

---

## ✅ Summary

Your system now has:
- ✅ **Functional email notification system**
- ✅ **Automatic emails to guides on new bookings**
- ✅ **All traveler and booking details included**
- ✅ **Professional HTML email template**
- ✅ **Development mode (console) active**
- ✅ **Production mode (SMTP) ready to activate**

**Next Steps:**
1. Test with console backend (current setup)
2. When ready for production, switch to SMTP backend
3. Customize email template as needed
