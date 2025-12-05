# CSE264 Final Project: Full Stack
## Due: Friday, May 2, 2025 at 11:59 PM
## Add your full name and Lehigh email address to this README!
## Nikhil Manakkal, nnm227@lehigh.edu

# Setup Guide

## Prerequisites

Make sure your system has the following tools installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## 1. Clone the Repository

```bash
git clone git@github.com:nnm227/StarMap.git
```

## 2. Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create a new database
CREATE DATABASE starmap;

# Create a user
CREATE USER starmap_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE starmap TO starmap_user;

# Connect to the database
\c starmap

# Grant schema permissions
GRANT ALL ON SCHEMA public TO starmap_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO starmap_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO starmap_user;
```

### Create Tables

Run the following SQL commands in your PostgreSQL database:

```sql
- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Markers Table
CREATE TABLE markers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    marker_id INTEGER REFERENCES markers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_flagged BOOLEAN DEFAULT FALSE
);

## 3. Server Setup

### Navigate to server directory
```bash
cd server
```

### Install dependencies
```bash
npm install
```

### Configure environment variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DBNAME=starmap
POSTGRES_USERNAME=starmap_user
POSTGRES_PASSWORD=your_password

# SSL Configuration (set to false for local development)
DB_SSL=false

# JWT Secret (generate a random string)
JWT_SECRET=your_very_long_random_secret_key_here_make_it_secure

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

### Start the server
```bash
npm run dev
```
The server should now be running on `http://localhost:3000`

## 4. Client Setup

Open a new terminal window/tab.

### Navigate to client directory
```bash
cd client
```

### Install dependencies
```bash
npm install
```

### Start the development server
```bash
npm run dev
```

The client should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 5. Initial Setup & Testing

### Create your first user

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Register" or navigate to `http://localhost:5173/register`
3. Create an account with:
   - Email
   - Username
   - Password

### Create an admin user (optional)

To make a user an admin, run this SQL command:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

Available roles:
- `user` (default) - Can add markers and comments
- `moderator` - Can delete any markers/comments (currrently the same as admin)
- `admin` - Full access (including user management in the future)
- `banned` - Cannot post markers or comments

## 6. Verify Installation

Test the following features:

1. **Registration & Login**
   - Register a new account
   - Log out
   - Log back in

2. **Map Features**
   - Click "Add Marker" button
   - Click on the map to place a marker
   - Fill in title and description
   - Submit the marker

3. **Comments**
   - Click on a marker
   - Add a comment
   - Delete your own comment


## Troubleshooting

### Server won't start

**Error: `permission denied for sequence users_id_seq`**
```sql
-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO starmap_user;
```

**Error: `The server does not support SSL connections`**
- Make sure `DB_SSL=false` in your `.env` file

### Client can't connect to server

- Verify server is running on port 3000
- Check for CORS errors in browser console
- Ensure `credentials: 'include'` is in all fetch requests

### Database connection issues
- Verify PostgreSQL is running: `pg_isready`
- Check your database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

## Development Notes

### Project Structure

```
client/
  ├── src/
  │   ├── components/
  │   │   ├── auth/       # Login & Register
  │   │   ├── map/        # Map components
  │   │   └── moderation/ # Comments & moderation
  │   ├── pages/          # Route pages
  │   └── styles/         # CSS files
  └── package.json

server/
  ├── routes/
  │   ├── auth.js         # Authentication endpoints
  │   ├── markers.js      # Marker CRUD
  │   ├── comments.js     # Comment CRUD
  │   └── users.js        # User management
  ├── db/
  │   └── postgres.js     # Database connection
  ├── app.js              # Express server
  └── package.json
```

### API Endpoints

**Authentication**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/current` - Get current user

**Markers**
- `GET /api/markers` - Get all markers
- `POST /api/markers` - Create marker
- `DELETE /api/markers/:id` - Delete marker

**Comments**
- `GET /api/comments?markerId=:id` - Get comments for marker
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id/flag` - Flag comment
- `DELETE /api/comments/:id` - Delete comment

### Technologies Used

**Frontend:**
- React 18
- React Router v6
- Leaflet (map library, this is our new library)
- Vite (build tool)

**Backend:**
- Node.js
- Express
- PostgreSQL
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in server `.env`
2. Set `DB_SSL=true` for production database
3. Use a secure JWT_SECRET
4. Build the client: `npm run build` in client directory
5. Serve the client build files through Express or a CDN
6. Use environment variables for all sensitive data
7. Enable HTTPS

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the code comments
- Check server logs for error messages
- Verify all dependencies are installed correctly

### Project Breakdown By Team Member

## Nikhil Manakkal
* Main task: design features for collaborative map
    * designed home page for website and map 
    * add markers to the map 
    * remove markers if marker owner or admin/mod
    * add/remove comments from markers
## Daniel Lee
* Main task: set up logins and user features
    * page to create user accounts (send POST request to backend)
    * page to log users into accounts (send GET request to backend) 
    * page for admin panel that can ban or "delete" users 
## Jake Fifer
* Main task: Create backend
    * GET, POST, PUT, DELETE requests for Users
    * GET, POST, PUT, DELETE requests for Markers
    * GET, POST, PUT, DELETE requests for Comments
## Everyone
* Work together to make sure that feature integrate together
* Communicate to make sure that backend and frontend follow the same structure (ie requests made from the frontend matches what the backend expects)
* Finalize project documentation such as installation guide and API setup
