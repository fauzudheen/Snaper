# Snaper - Modern Image Gallery Application

Snaper is a full-stack image gallery application built with Django Rest Framework and React TypeScript, offering a seamless experience for managing personal image collections with  features like drag-and-drop organization, bulk uploads, and secure authentication.

## Features

- **User Authentication**
  - JWT-based authentication with access and refresh tokens
  - Secure email verification
  - Password reset functionality with OTP verification

- **Image Management**
  - Drag-and-drop image organization
  - Bulk image uploads
  - Individual image titles and metadata
  - Image editing and deleting capabilities

- **User Interface**
  - Responsive design
  - Intuitive drag-and-drop interface
  - Real-time updates
  - Modern gallery layout

## Tech Stack

### Backend
- Django Rest Framework
- PostgreSQL
- JWT Authentication
- Django CORS headers

### Frontend
- React with TypeScript
- React Beautiful DND
- Axios for API calls
- TailwindCSS

## Local Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/fauzudheen/Snaper.git
cd snaper
```

2. Set up Python virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
Create a `.env` file in the backend directory:
```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://username:password@localhost:5432/snaper
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

5. Run migrations
```bash
python manage.py migrate
```

6. Start the development server
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server
```bash
npm run dev
```

The application should now be running at:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/signin/` - User login
- `POST /api/signup/` - User registration
- `POST /api/verify-email/` - Email verification
- `POST /api/resend-otp/` - Resend OTP for verification
- `POST /api/forgot-password/` - Initiate password reset
- `POST /api/verify-email-forgot-password/` - Verify email during password reset
- `POST /api/reset-password/` - Reset password
- `POST /api/token/verify/` - Verify JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### User Management
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Image Management
- `GET /api/images/` - List all images
- `POST /api/images/` - Upload single image
- `GET /api/images/{id}/` - Get image details
- `PUT /api/images/{id}/` - Update image
- `DELETE /api/images/{id}/` - Delete image
- `POST /api/images/upload-multiple/` - Bulk image upload
- `POST /api/images/update-orders/` - Update image ordering

## Deployment

### Backend Deployment (Example using Railway)
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy the backend service

### Frontend Deployment (Example using Vercel)
1. Push your code to GitHub
2. Create a new project on Vercel
3. Import your repository
4. Configure environment variables
5. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- React Beautiful DND for drag-and-drop functionality
- Django Rest Framework for powerful API capabilities
