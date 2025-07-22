# Big Bull Events Ticketing System

## Overview
Big Bull Events Ticketing is a full-stack web application designed to streamline event ticket sales, management, and validation. It provides a seamless experience for users to browse events, purchase tickets, and validate entry using QR codes. The platform is built with a modern React frontend and a Node.js/Express backend, ensuring robust performance and scalability.

## Features
- **User Dashboard**: Browse upcoming and available events, view event highlights, and purchase tickets.
- **Admin Dashboard**: Manage events, tickets, and users with secure authentication.
- **Ticket Purchase**: Secure ticket buying process with instant QR code generation.
- **QR Code Validation**: Real-time ticket validation using QR code scanning.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Legal & Support**: Includes privacy policy, terms of service, refund policy, and support contact information.

## Technologies Used
- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: (Configure in `event-ticket-backend/config/db.js`)
- **QR Code**: html5-qrcode (frontend), custom backend logic
- **Authentication**: JWT-based authentication

## Project Structure
```
event-ticket-backend/
  ├── config/           # Database configuration
  ├── middleware/       # Auth middleware
  ├── models/           # Mongoose models (admin, ticket, user)
  ├── routes/           # API routes (admin, tickets, users)
  ├── scripts/          # Utility scripts
  ├── utils/            # Helper utilities
  ├── server.js         # Main Express server
  └── package.json      # Backend dependencies

event-ticketing-frontend/
  ├── public/           # Static assets
  ├── src/
  │   ├── assets/       # Images, videos
  │   ├── components/   # React components
  │   ├── utils/        # Frontend utilities
  │   ├── App.jsx       # Main app component
  │   └── main.jsx      # Entry point
  ├── index.html        # HTML template
  ├── tailwind.config.js# Tailwind CSS config
  ├── vite.config.js    # Vite config
  └── package.json      # Frontend dependencies
```

## Getting Started
### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/ShenalSen/Big-Bull-Events-Ticketing.git
   cd Big-Bull-Events-Ticketing
   ```
2. **Install backend dependencies:**
   ```sh
   cd event-ticket-backend
   npm install
   ```
3. **Install frontend dependencies:**
   ```sh
   cd ../event-ticketing-frontend
   npm install
   ```

### Configuration
- **Backend**: Update MongoDB connection string in `event-ticket-backend/config/db.js`.
- **Frontend**: Adjust API endpoints in components if deploying to production.

### Running the Application
1. **Start the backend server:**
   ```sh
   cd event-ticket-backend
   npm start
   ```
2. **Start the frontend development server:**
   ```sh
   cd ../event-ticketing-frontend
   npm run dev
   ```
3. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

## Usage
- **Users**: Register, log in, browse events, purchase tickets, and validate tickets at event entry.
- **Admins**: Log in to manage events, tickets, and users.

## QR Code Ticketing
- Tickets are generated with unique QR codes upon purchase.
- QR codes are validated at event entry using the built-in QR scanner.
- Example QR code data format:
  ```json
  {
    "ticket_id": "ticket_123456",
    "email": "user@example.com"
  }
  ```

## License
This project is licensed under the MIT License.

## Contact
For support or inquiries, email: [support@info.bigbullticketing.com](mailto:support@info.bigbullticketing.com)

---
Designed & Developed by CODACIT TECHNOLOGIES
