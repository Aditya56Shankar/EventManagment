# Event Management System API

A RESTful API for managing events and bookings built with Node.js, Express, and MySQL.

## Features

- User Registration & Authentication
- Role-based Access Control (User & Admin)
- Event Management (CRUD operations)
- Booking System
- Seat Management

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DB_NAME=event_management
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```
4. Create a MySQL database named `event_management`
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Events

- `GET /events` - Get all events (public)
- `GET /events/:id` - Get single event (public)
- `POST /events` - Create event (admin only)
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)

### Bookings

- `GET /bookings/my-bookings` - Get user's bookings
- `POST /bookings/:eventId` - Book an event
- `DELETE /bookings/:bookingId` - Cancel booking

## Request/Response Examples

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Event (Admin)
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "dateTime": "2024-06-15T09:00:00Z",
  "location": "Convention Center",
  "totalSeats": 100
}
```

### Book Event
```http
POST /bookings/:eventId
Authorization: Bearer <token>
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "message": "Error message",
  "error": "Detailed error information (in development)"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT authentication
- Role-based access control
- Input validation
- Secure password storage 