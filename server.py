import os
from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load sensitive info from environment variables
gmail_user = os.getenv('GMAIL_USER')
gmail_pass = os.getenv('GMAIL_PASS')
recipient_email = os.getenv('RECIPIENT_EMAIL', gmail_user)

@app.route('/send-inquiry', methods=['POST'])
def send_inquiry():
    data = request.form
    name = data.get('name', '')
    contact_method = data.get('contact-method', '')
    phone = data.get('phone', '')
    email = data.get('email', '')
    coverage = ', '.join(request.form.getlist('coverage'))
    organization = data.get('organization', '')
    event_date = data.get('event-date', '')
    notes = data.get('notes', '')

    # Build the email content
    subject = f"New Inquiry from {name} - Z Photography Contact Form"
    body = f"""
    Name: {name}
    Preferred Contact Method: {contact_method}
    Phone: {phone}
    Email: {email}
    Type of Coverage: {coverage}
    Organization: {organization}
    Event Date(s): {event_date}
    Notes/Questions: {notes}
    """

    msg = MIMEMultipart()
    msg['From'] = gmail_user
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(gmail_user, gmail_pass)
            server.sendmail(gmail_user, recipient_email, msg.as_string())
        return jsonify({'success': True, 'message': 'Inquiry sent successfully!'}), 200
    except Exception as e:
        print('Error sending email:', e)
        return jsonify({'success': False, 'message': 'Failed to send inquiry.'}), 500

if __name__ == '__main__':
    app.run(debug=True) 