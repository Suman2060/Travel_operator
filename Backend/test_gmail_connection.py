"""
Quick Gmail Email Test with Better Error Handling
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def test_gmail_connection():
    email = 'sumandangol2060@gmail.com'
    password = 'wwcyfkppyajyqeor'  # Removed spaces
    
    print("Testing Gmail SMTP connection...")
    print(f"Email: {email}")
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = email
        msg['To'] = email  # Send to yourself for testing
        msg['Subject'] = "Test Email from Travel App"
        
        body = "If you receive this, email is working! ✅"
        msg.attach(MIMEText(body, 'plain'))
        
        # Connect to Gmail
        print("Connecting to Gmail SMTP server...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        print("Logging in...")
        server.login(email, password)
        
        print("Sending email...")
        server.send_message(msg)
        
        print("✅ SUCCESS! Email sent successfully!")
        print(f"Check your inbox at {email}")
        
        server.quit()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Authentication Error: {e}")
        print("\nPossible fixes:")
        print("1. Make sure 2-Step Verification is enabled on your Google account")
        print("2. Generate a NEW App Password at: https://myaccount.google.com/apppasswords")
        print("3. OR enable 'Less secure app access' at: https://myaccount.google.com/lesssecureapps")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_gmail_connection()
