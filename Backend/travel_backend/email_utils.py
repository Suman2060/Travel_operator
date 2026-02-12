from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_booking_notification_to_guide(booking):
    """
    Send email notification to guide when a new booking is created.
    
    Args:
        booking: Booking instance
    """
    guide = booking.package.guide
    traveler = booking.user
    package = booking.package
    
    # Email subject
    subject = f'New Booking Alert: {package.title}'
    
    # Email body (HTML version)
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                    🎉 New Booking Received!
                </h2>
                
                <p>Dear <strong>{guide.username}</strong>,</p>
                
                <p>You have received a new booking for your tour package. Here are the details:</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin-top: 0;">📦 Package Information</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 40%;">Package Name:</td>
                            <td style="padding: 8px 0;">{package.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                            <td style="padding: 8px 0;">{package.location}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                            <td style="padding: 8px 0;">{package.duration} days</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Price per Person:</td>
                            <td style="padding: 8px 0;">Rs. {package.price} (${float(package.price) / 133:.2f} USD)</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin-top: 0;">👤 Traveler Information</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
                            <td style="padding: 8px 0;">{traveler.username}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                            <td style="padding: 8px 0;">{traveler.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                            <td style="padding: 8px 0;">{traveler.phone_number or 'Not provided'}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin-top: 0;"> Booking Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 40%;">Travel Date:</td>
                            <td style="padding: 8px 0;">{booking.travel_date.strftime('%B %d, %Y')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Number of Travelers:</td>
                            <td style="padding: 8px 0;">{booking.num_travelers}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Total Price:</td>
                            <td style="padding: 8px 0; color: #16a34a; font-size: 18px; font-weight: bold;">
                                Rs. {booking.total_price} (${float(booking.total_price) / 133:.2f} USD)
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                            <td style="padding: 8px 0;">
                                <span style="background-color: #22c55e; color: white; padding: 4px 12px; border-radius: 4px;">
                                    {booking.get_status_display()}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Booking ID:</td>
                            <td style="padding: 8px 0;">#{booking.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Booked On:</td>
                            <td style="padding: 8px 0;">{booking.created_at.strftime('%B %d, %Y at %I:%M %p')}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0;">
                        <strong> Action Required:</strong> Please review this booking and contact the traveler 
                        if you need any additional information.
                    </p>
                </div>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>Chill Travel Team</strong>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    This is an automated notification from Chill Travel. Please do not reply to this email.
                </p>
            </div>
        </body>
    </html>
    """
    
    # Plain text version (fallback)
    plain_message = f"""
New Booking Received!

Dear {guide.username},

You have received a new booking for your tour package.

PACKAGE INFORMATION:
- Package Name: {package.title}
- Location: {package.location}
- Duration: {package.duration} days
- Price per Person: Rs. {package.price} (${float(package.price) / 133:.2f} USD)

TRAVELER INFORMATION:
- Name: {traveler.username}
- Email: {traveler.email}
- Phone: {traveler.phone_number or 'Not provided'}

BOOKING DETAILS:
- Travel Date: {booking.travel_date.strftime('%B %d, %Y')}
- Number of Travelers: {booking.num_travelers}
- Total Price: Rs. {booking.total_price} (${float(booking.total_price) / 133:.2f} USD)
- Status: {booking.get_status_display()}
- Booking ID: #{booking.id}
- Booked On: {booking.created_at.strftime('%B %d, %Y at %I:%M %p')}

Please review this booking and contact the traveler if you need any additional information.

Best regards,
Chill Travel Team

---
This is an automated notification from Chill Travel.
    """
    
    try:
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[guide.email],
            html_message=html_message,
            fail_silently=False,
            # Allow guide to reply directly to the traveler
            reply_to=[traveler.email],
        )
        return True
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"ERROR: Failed to send email to {guide.email}: {str(e)}")
        return False

def send_cancellation_notification_to_guide(booking):
    """
    Send email notification to guide when a booking is cancelled.
    
    Args:
        booking: Booking instance
    """
    guide = booking.package.guide
    traveler = booking.user
    package = booking.package
    
    # Email subject
    subject = f'Booking Cancelled: {package.title}'
    
    # Email body (HTML version)
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
                     Booking Cancelled
                </h2>
                
                <p>Dear <strong>{guide.username}</strong>,</p>
                
                <p>A booking for your tour package has been cancelled by the traveler.</p>
                
                <div style="background-color: #fce7f3; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #831843; margin-top: 0;">❌ Cancelled Booking Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 40%;">Package Name:</td>
                            <td style="padding: 8px 0;">{package.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Traveler Name:</td>
                            <td style="padding: 8px 0;">{traveler.username}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Travel Date:</td>
                            <td style="padding: 8px 0;">{booking.travel_date.strftime('%B %d, %Y')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Booking ID:</td>
                            <td style="padding: 8px 0;">#{booking.id}</td>
                        </tr>
                    </table>
                </div>
                
                <p>No further action is required from your side regarding this specific booking.</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>Chill Travel Team</strong>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    This is an automated notification from Chill Travel.
                </p>
            </div>
        </body>
    </html>
    """
    
    # Plain text version
    plain_message = f"""
Booking Cancelled

Dear {guide.username},

A booking for your tour package has been cancelled by the traveler.

DETAILS:
- Package: {package.title}
- Traveler: {traveler.username}
- Travel Date: {booking.travel_date.strftime('%B %d, %Y')}
- Booking ID: #{booking.id}

No further action is required.

Best regards,
Chill Travel Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[guide.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"ERROR: Failed to send cancellation email to {guide.email}: {str(e)}")
        return False

def send_booking_confirmation_to_traveler(booking):
    """
    Send booking confirmation email to the traveler.
    
    Args:
        booking: Booking instance
    """
    traveler = booking.user
    package = booking.package
    guide = package.guide
    
    # Email subject
    subject = f'Booking Confirmed: {package.title}'
    
    # Email body (HTML version)
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                    ✅ Booking Confirmed!
                </h2>
                
                <p>Dear <strong>{traveler.username}</strong>,</p>
                
                <p>Your booking for <strong>{package.title}</strong> has been successfully confirmed.</p>
                
                <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #065f46; margin-top: 0;">📅 Your Trip Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 40%;">Travel Date:</td>
                            <td style="padding: 8px 0;">{booking.travel_date.strftime('%B %d, %Y')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                            <td style="padding: 8px 0;">{package.location}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                            <td style="padding: 8px 0;">{package.duration} days</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Guide:</td>
                            <td style="padding: 8px 0;">{guide.username}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Total Price:</td>
                            <td style="padding: 8px 0;">Rs. {booking.total_price} (${float(booking.total_price) / 133:.2f} USD)</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Booking ID:</td>
                            <td style="padding: 8px 0;">#{booking.id}</td>
                        </tr>
                    </table>
                </div>
                
                <p>If you have any questions, you can reply directly to this email to contact your guide.</p>
                
                <p style="margin-top: 30px;">
                    Have a safe trip!<br>
                    <strong>Chill Travel Team</strong>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    This is an automated confirmation.
                </p>
            </div>
        </body>
    </html>
    """
    
    # Plain text version
    plain_message = f"""
Booking Confirmed!

Dear {traveler.username},

Your booking for {package.title} has been successfully confirmed.

TRIP DETAILS:
- Travel Date: {booking.travel_date.strftime('%B %d, %Y')}
- Location: {package.location}
- Duration: {package.duration} days
- Guide: {guide.username}
- Total Price: Rs. {booking.total_price} (${float(booking.total_price) / 133:.2f} USD)
- Booking ID: #{booking.id}

Have a safe trip!

Best regards,
Chill Travel Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[traveler.email],
            html_message=html_message,
            fail_silently=False,
            # Allow traveler to reply to guide
            reply_to=[guide.email],
        )
        return True
    except Exception as e:
        print(f"ERROR: Failed to send confirmation email to {traveler.email}: {str(e)}")
        return False
