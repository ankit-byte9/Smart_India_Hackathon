# Attendify Frontend

A modern React frontend for the Attendify attendance management system with facial recognition capabilities.

## Features

- **Landing Page**: Clean welcome page with role-based navigation
- **Admin Dashboard**: 
  - Register new teachers
  - Register students with photo uploads
  - Train facial recognition model
  - View attendance records (placeholder)
- **Teacher Dashboard**:
  - Upload class photos for attendance
  - View recognized students
  - Historical attendance sessions (placeholder)
- **Authentication**: JWT-based authentication with role-based access control
- **Responsive Design**: Clean, mobile-friendly interface

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Plain CSS** - Styling without UI libraries

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Attendify/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit http://localhost:5173

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable components (future expansion)
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── LandingPage.jsx # Home/welcome page
│   ├── AdminLogin.jsx  # Admin login form
│   ├── TeacherLogin.jsx # Teacher login form
│   ├── AdminDashboard.jsx # Admin management interface
│   └── TeacherDashboard.jsx # Teacher attendance interface
├── services/           # API service layer
│   └── api.js         # Axios configuration and API calls
├── App.jsx            # Main app component with routing
├── main.jsx           # React app entry point
└── index.css          # Global styles
```

## API Integration

The frontend connects to the FastAPI backend with the following endpoints:

- `POST /admin/token` - Admin authentication
- `POST /teacher/token` - Teacher authentication
- `POST /admin/register_teacher` - Register new teacher
- `POST /admin/register_student` - Register student with photo
- `POST /train` - Train facial recognition model
- `POST /upload` - Upload attendance photo

### Authentication

- JWT tokens are stored in memory (not localStorage per requirements)
- Automatic token inclusion in API requests via Axios interceptors
- Role-based route protection

## Usage

### Demo/Testing

Since this is a scaffolded frontend, you can test the UI flows even without a running backend:

1. Navigate through the landing page
2. Try the login forms (they will show errors without backend)
3. Explore the dashboard interfaces and forms

### With Backend

1. Start the FastAPI backend server
2. Create admin/teacher accounts via backend
3. Login through the frontend forms
4. Use all functionality including file uploads and API calls

## Development Notes

- **No localStorage**: Tokens are kept in memory as per requirements
- **Placeholder Data**: Some sections show placeholder data for demonstration
- **Error Handling**: Comprehensive error handling for API calls
- **Loading States**: User feedback during async operations
- **Responsive**: Mobile-friendly design

## Future Enhancements

- Real-time attendance updates
- Student photo gallery
- Attendance analytics and reporting
- Email notifications
- Dark mode support
- Progressive Web App (PWA) features

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend has CORS middleware configured
2. **API Connection**: Verify backend is running on port 8000
3. **File Upload Issues**: Check file size limits and formats
4. **Authentication**: Ensure proper admin/teacher accounts exist in backend

### Development

- Use browser developer tools to inspect network requests
- Check console for any JavaScript errors
- Verify API responses in Network tab
