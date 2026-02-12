"""
Direct email test - bypasses Django ORM to test SMTP
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

email = 'sumandangol2060@gmail.com'
password = 'wwcyfkppyajyqeor'

print("=" * 60)
print("DIRECT GMAIL SMTP TEST")
print("=" * 60)

try:
    msg = MIMEMultipart()
    msg['From'] = email
    msg['To'] = email
    msg['Subject'] = "🧪 Test Email from Travel App - Direct SMTP"
    
    body = """
This is a direct SMTP test.

If you receive this email, it means:
✅ Gmail credentials are correct
✅ SMTP connection works
✅ Emails CAN reach your inbox

If booking emails are not arriving, the issue is in Django's email sending code.

Timestamp: """ + str(__import__('datetime').datetime.now())
    
    msg.attach(MIMEText(body, 'plain'))
    
    print(f"Connecting to Gmail SMTP...")
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.set_debuglevel(1)  # Show detailed SMTP conversation
    server.starttls()
    
    print(f"\nLogging in as {email}...")
    server.login(email, password)
    
    print(f"\nSending test email...")
    server.send_message(msg)
    server.quit()
    
    print("\n" + "=" * 60)
    print("✅ EMAIL SENT SUCCESSFULLY!")
    print(f"Check inbox at: {email}")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
