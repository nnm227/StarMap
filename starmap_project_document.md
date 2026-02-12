<!-- This document was modified from our project overview pdf document submitted by email -->
# Team Starfruit Project Document

**Project Name:** StarMap

## Team Members
# Nikhil Manakkal
* Main task: design features for collaborative map that function with backend
    * designed home page for website and map 
    * add markers to the map 
    * remove markers if marker owner or admin/mod
    * add/remove comments from markers
    * finalized project documentation (installation guide and API setup)

# Daniel Lee
* Main task: Set up logins and user features
    * page to create user accounts (send POST request to backend)
    * page to log users into accounts (send GET request to backend) 
# Jake Fifer
* Main task: Created backend
    * GET, POST, PUT, DELETE requests for Users
    * GET, POST, PUT, DELETE requests for Markers
    * GET, POST, PUT, DELETE requests for Comments
# Everyone
* Work together to make sure that feature integrate together
* Communicate to make sure that backend and frontend follow the same structure (ie requests made from the frontend matches what the backend expects)
## Application Functionality

### User Accounts & Roles
The application has three user roles:

1. **User**
   * Can create markers on the map.
   * Can edit/delete their markers.
   * Can add comments to events.
2. **Moderator**
   * Can delete markers.
   * Can delete inappropriate comments.
3. **Admin**
   * Full access to all markers and comments.
   * Can ban users.
   * Can manage moderator permissions.

### Database
The application uses a PostgreSQL database with:
* **Users:** Authentication information, roles, profile data.
* **Markers:** Event location, owner, title, description, timestamp.
* **Comments:** User comments attached to markers.

### Interactive UI

The frontend displays an interactive campus map in which you can pan, zoom, and search for locations. Users can click on the map to add event markers, open markers to view details, and read or write comments. Markers update in real time when users add or modify events.

### New Library or Framework
* We will use **Leaflet.js** for the interactive map.
* Leaflet allows us to display a map in the browser, place markers, and control zooming and panning.

## API Strategy

### Internal REST API
A Node.js and Express REST API will handle:
* User authentication.
* Marker CRUD operations.
* Comment posting / deletion.
* Permissions for moderators and admins.

### External REST API
* The application will use **OpenStreetMap** to fetch the map tiles that Leaflet displays.

### User Story

A new user visits the site and sees an interactive campus map. Logged out, they can browse existing event markers. After creating an account, they can post an event marker anywhere by clicking on the map. They can comment on events posted by other users. Moderators can remove markers and comments. Admins can manage user access.

## Technical Design

### Frontend
* **React** for building UI.
* **Leaflet.js** for displaying the map.
* Standard browser APIs for backend communication.

### Backend
* **Node.js** and **Express** to handle requests.
* Server side checks to verify user roles.
* Routes for creating, retrieving, updating, deleting markers and comments.

### Database
* **PostgreSQL** as main database.
* Tables for:
   * Users (account information and roles).
   * Markers (event details and map location).
   * Comments (user comments attached to markers).

