# Website_Auth

This project is a full-stack web application with authentication, built with Node.js for the backend, Next.js for the frontend, and MongoDB for the database.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Introduction

This project is designed to provide a comprehensive example of a full-stack application with user authentication. The backend is powered by Node.js and Express, the frontend is developed with Next.js, and MongoDB is used as the database to store user information.

## Features

- User registration
- User login
- Password hashing
- Protected routes
- Session management

## Technologies Used

- **Backend:** Node.js, Express
- **Frontend:** Next.js, React
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT), bcrypt

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the MongoDB server:**

   Make sure your MongoDB server is running. If you're using MongoDB Atlas, ensure your connection string is correctly set up.

2. **Start the Backend:**

   ```bash
   cd backend
   npm run dev
   ```

   The backend server should now be running on `http://localhost:5000`.

3. **Start the Frontend:**

   ```bash
   cd ../frontend
   npm run dev
   ```

   The frontend application should now be running on `http://localhost:3000`.

## Project Structure

```
your-repo-name/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   └── next.config.js
├── README.md
└── package.json
```

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Registers a new user.
  - Request body: `{ "username": "string", "password": "string" }`

- **POST /api/auth/login**
  - Authenticates a user and returns a token.
  - Request body: `{ "username": "string", "password": "string" }`

- **GET /api/auth/profile**
  - Retrieves the authenticated user's profile.
  - Headers: `{ "Authorization": "Bearer token" }`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README file according to your specific project requirements.