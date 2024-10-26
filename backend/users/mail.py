from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_signup_verification_email(email, otp):
    subject = "Welcome to Snaper - Verify Your Email"
    from_email = settings.DEFAULT_FROM_EMAIL
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            body {{
                font-family: 'Poppins', Arial, sans-serif;
                background-color: #f8f8f8;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }}
            
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%);
                border-radius: 20px;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }}
            
            .header {{
                background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
                padding: 30px 20px;
                text-align: center;
                position: relative;
            }}
            
            .header::after {{
                content: '';
                position: absolute;
                bottom: -20px;
                left: 0;
                right: 0;
                height: 40px;
                background: white;
                border-radius: 50% 50% 0 0;
            }}
            
            .logo {{
                font-size: 32px;
                font-weight: 700;
                color: white;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            }}
            
            .content {{
                padding: 40px;
                color: #333;
            }}
            
            .greeting {{
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #1a1a1a;
            }}
            
            .otp-container {{
                background: linear-gradient(145deg, #f6f6f6, #ffffff);
                border: 2px dashed #ff0000;
                border-radius: 15px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
                box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
            }}
            
            .otp {{
                font-size: 36px;
                font-weight: 700;
                color: #ff0000;
                letter-spacing: 8px;
                margin: 10px 0;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }}
            
            .message {{
                line-height: 1.6;
                color: #555;
                margin-bottom: 20px;
            }}
            
            .footer {{
                background: #f1f1f1;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }}
            
            .social-links {{
                margin: 20px 0;
            }}
            
            .social-links span {{
                display: inline-block;
                margin: 0 10px;
                color: #ff0000;
                font-weight: 600;
            }}
            
            .highlight {{
                color: #ff0000;
                font-weight: 500;
            }}
            
            @media only screen and (max-width: 600px) {{
                .container {{
                    margin: 20px;
                    border-radius: 15px;
                }}
                
                .content {{
                    padding: 20px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">Snaper</h1>
            </div>
            <div class="content">
                <h2 class="greeting">Welcome to Snaper! 🚀</h2>
                <p class="message">
                    You're just one step away from joining our amazing community. To ensure the security of your account, 
                    please verify your email address using the verification code below:
                </p>
                
                <div class="otp-container">
                    <p style="margin: 0; color: #666;">Your Verification Code</p>
                    <div class="otp">{otp}</div>
                    <p style="margin: 5px 0; font-size: 12px; color: #888;">Valid for 5 minutes</p>
                </div>
                
                <p class="message">
                    If you didn't create an account with <span class="highlight">Snaper</span>, 
                    you can safely ignore this email.
                </p>
                
                <div class="social-links">
                    <span>#JoinSnaper</span>
                    <span>#CreateMore</span>
                    <span>#SnaperCommunity</span>
                </div>
            </div>
            <div class="footer">
                <p>© 2024 Snaper. All rights reserved.</p>
                <p>Questions? Contact our support team at support@snaper.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    email_msg = EmailMultiAlternatives(subject, "", from_email, [email])
    email_msg.attach_alternative(html_content, "text/html")
    email_msg.send()

def send_password_reset_email(email, otp):
    subject = "Reset Your Snaper Password"
    from_email = settings.DEFAULT_FROM_EMAIL
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            body {{
                font-family: 'Poppins', Arial, sans-serif;
                background-color: #f8f8f8;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }}
            
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%);
                border-radius: 20px;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }}
            
            .header {{
                background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
                padding: 30px 20px;
                text-align: center;
                position: relative;
            }}
            
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="rgba(255,255,255,0.1)" x="0" y="0" width="100" height="100"/></svg>');
                opacity: 0.1;
            }}
            
            .logo {{
                font-size: 32px;
                font-weight: 700;
                color: white;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            }}
            
            .content {{
                padding: 40px;
                color: #333;
            }}
            
            .alert-icon {{
                text-align: center;
                margin-bottom: 30px;
            }}
            
            .alert-icon span {{
                font-size: 48px;
                color: #ff0000;
            }}
            
            .otp-container {{
                background: linear-gradient(145deg, #f6f6f6, #ffffff);
                border: 2px dashed #ff0000;
                border-radius: 15px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
                box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
            }}
            
            .otp {{
                font-size: 36px;
                font-weight: 700;
                color: #ff0000;
                letter-spacing: 8px;
                margin: 10px 0;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }}
            
            .security-notice {{
                background: rgba(255, 0, 0, 0.05);
                border-left: 4px solid #ff0000;
                padding: 15px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }}
            
            .message {{
                line-height: 1.6;
                color: #555;
                margin-bottom: 20px;
            }}
            
            .footer {{
                background: #f1f1f1;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }}
            
            @media only screen and (max-width: 600px) {{
                .container {{
                    margin: 20px;
                    border-radius: 15px;
                }}
                
                .content {{
                    padding: 20px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">Snaper</h1>
            </div>
            <div class="content">
                <div class="alert-icon">
                    <span>🔐</span>
                </div>
                
                <p class="message">
                    We received a request to reset the password for your Snaper account. 
                    To proceed with the password reset, please use the following code:
                </p>
                
                <div class="otp-container">
                    <p style="margin: 0; color: #666;">Password Reset Code</p>
                    <div class="otp">{otp}</div>
                    <p style="margin: 5px 0; font-size: 12px; color: #888;">Valid for 5 minutes</p>
                </div>
                
                <div class="security-notice">
                    <strong>Security Notice:</strong>
                    <p style="margin: 5px 0;">
                        If you didn't request this password reset, please ignore this email or contact 
                        our support team immediately if you believe your account has been compromised.
                    </p>
                </div>
                
                <p class="message">
                    For security reasons, this password reset code will expire in 5 minutes. 
                    If you need a new code, you can request another password reset.
                </p>
            </div>
            <div class="footer">
                <p>© 2024 Snaper. All rights reserved.</p>
                <p>Security concern? Contact us immediately at security@snaper.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    email_msg = EmailMultiAlternatives(subject, "", from_email, [email])
    email_msg.attach_alternative(html_content, "text/html")
    email_msg.send()

def send_resend_otp_email(email, otp):
    subject = "Your New Verification Code - Snaper"
    from_email = settings.DEFAULT_FROM_EMAIL
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            body {{
                font-family: 'Poppins', Arial, sans-serif;
                background-color: #f8f8f8;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }}
            
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%);
                border-radius: 20px;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                position: relative;
            }}
            
            .header {{
                background: linear-gradient(135deg, #3b2dff 0%, #7161ff 100%);
                padding: 35px 20px;
                text-align: center;
                position: relative;
            }}
            
            .header::after {{
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 40px;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
                background-size: cover;
                transform: scale(1.2);
            }}
            
            .logo {{
                font-size: 32px;
                font-weight: 700;
                color: white;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
                position: relative;
                z-index: 2;
            }}
            
            .content {{
                padding: 40px;
                color: #333;
                position: relative;
                z-index: 1;
            }}
            
            .message-box {{
                background: rgba(59, 45, 255, 0.03);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                border: 1px solid rgba(59, 45, 255, 0.1);
            }}
            
            .otp-container {{
                background: linear-gradient(145deg, #ffffff, #f8f9ff);
                border: 2px solid rgba(59, 45, 255, 0.3);
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                text-align: center;
                box-shadow: 0 4px 15px rgba(59, 45, 255, 0.1);
                position: relative;
                overflow: hidden;
            }}
            
            .otp-container::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(90deg, #3b2dff, #7161ff);
            }}
            
            .otp {{
                font-size: 40px;
                font-weight: 700;
                color: #3b2dff;
                letter-spacing: 8px;
                margin: 15px 0;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
            }}
            
            .timer {{
                display: inline-block;
                padding: 8px 15px;
                background: rgba(59, 45, 255, 0.1);
                border-radius: 20px;
                font-size: 14px;
                color: #3b2dff;
                font-weight: 500;
                margin-top: 10px;
            }}
            
            .action-required {{
                display: inline-block;
                padding: 8px 15px;
                background: rgba(59, 45, 255, 0.9);
                color: white;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 20px;
            }}
            
            .message {{
                line-height: 1.8;
                color: #555;
                margin-bottom: 20px;
                font-size: 15px;
            }}
            
            .help-text {{
                font-size: 13px;
                color: #666;
                line-height: 1.6;
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }}
            
            .footer {{
                background: #f8f9ff;
                padding: 25px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid rgba(59, 45, 255, 0.1);
            }}
            
            .highlight {{
                color: #3b2dff;
                font-weight: 500;
            }}
            
            @media only screen and (max-width: 600px) {{
                .container {{
                    margin: 20px;
                    border-radius: 15px;
                }}
                
                .content {{
                    padding: 25px;
                }}
                
                .otp {{
                    font-size: 32px;
                    letter-spacing: 6px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">Snaper</h1>
            </div>
            <div class="content">
                <div class="action-required">New Verification Code</div>
                
                <div class="message-box">
                    <p class="message">
                        We've generated a new verification code for your Snaper account. 
                        The previous code has been deactivated for security purposes.
                    </p>
                </div>
                
                <div class="otp-container">
                    <p style="margin: 0; color: #666; font-size: 15px;">Your New Verification Code</p>
                    <div class="otp">{otp}</div>
                    <div class="timer">Valid for 5 minutes</div>
                </div>
                
                <p class="message">
                    Please use this code to complete your verification process. For security reasons, 
                    this code will expire in <span class="highlight">5 minutes</span>.
                </p>
                
                <div class="help-text">
                    <strong>Having trouble?</strong><br>
                    If you're experiencing any issues with the verification process, 
                    our support team is here to help 24/7 at support@snaper.com
                </div>
            </div>
            <div class="footer">
                <p>© 2024 Snaper. All rights reserved.</p>
                <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    email_msg = EmailMultiAlternatives(subject, "", from_email, [email])
    email_msg.attach_alternative(html_content, "text/html")
    email_msg.send()