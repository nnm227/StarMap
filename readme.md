# CSE264 Final Project: Full Stack
## Due: Friday, May 2, 2025 at 11:59 PM
## Add your full name and Lehigh email address to this README!
## Nikhil Manakkal, nnm227@lehigh.edu


### Tasks Todo By Team Member

## Nikhil Manakkal
* Main task: use Leaflet to design interactive map
* todo:
    * design home page for website and map (complete)
    * add markers to the map (needs backend)
    * edit markers if marker owner or admin/mod  (needs backend)
    * remove markers if marker owner or admin/mod  (needs backend)
## Daniel Lee
* Main task: set up database and handle logins
* todo:
    * set up 3 new databases *Users*, *Markers*, and *Comments*
    * page to create user accounts (send POST request to backend) (needs backend)
    * page to log users into accounts (send GET request to backend) (needs backend)
    * page for admin panel that can ban or "delete" users (needs backend)
## Jake Fifer
* Main task: create internal API structure to submit queries to database
* todo:
    * GET, POST, PUT, DELETE requests for Users
    * GET, POST, PUT, DELETE requests for Markers
    * GET, POST, PUT, DELETE requests for Comments
## Everyone
* Work together to make sure that feature integrate together
* Communicate to make sure that backend and frontend follow the same structure (ie requests made from the frontend matches what the backend expects)
* Finalize project documentation such as installation guide and API setup



This repo contains the boilerplate code for a full stack application using Express and React.  If you need a database table, please let your instructor know.

### Project Requirements
Your web application should have/do the following:

Your web application must include the following:
* User Accounts & Roles: Implement different user roles such as user/admin, free/paid, etc.
* Database: Your application must store and retrieve data from a database of your choice.
* Interactive UI: Your web app must have an interactive user interface, which can include forms, real-time updates, animations, or other dynamic elements.
* New Library or Framework: You must use at least one library or framework that was not covered in class.
* Internal REST API: Your project must have an API layer used to store and retrieve data
* External REST API: You may include an external REST API (e.g., Reddit API, Spotify API, OpenWeather API, etc.).


### Installation and Running the Project

#### Client
The client for this project uses React + Vite template which provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project on localhost:5173 (or at the location specified in the console).

#### Server
You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project with nodemon. Nodemon auto-restarts the node server every time you make a change to a file. This is very helpful when you are writing and testing code.

##### .env and Postgres Installation

A Postgres instance may have been provided to you. Your username for the database is your 6 character alphanumeric lehigh id. Your password for the database is your 6 character alphanumeric lehigh id followed by '_lehigh'.

You will need to create a .env from the .env.example You can do this by running this line of code in your terminal 

`cp .env.example .env`

Then store your Database credentials in your .env file.

**Note: Never EVER push private information (like credentials) to a Git Repo. We use .env to store this connection information and ensure that git (using .gitignore) never pushes this private information in the repo. Never ever store real credentials in .env.example or anywhere that is not .env as you may push these changes to your git repo.**

### Grading
* **Project Functionality** -- **30 points** -- Meets all outlined requirements
* **Technical Implementation** -- **25 points** -- Clean code, database integration, API Usage
* **UI/UX & Interactivity** -- **15 points** -- Well-designed, intuitive, and responsive UI
* **Use of New Tech** -- **10 points** -- Implements a library/framework not covered in class
* **Project Documentation** -- **10 points** -- Clear README, installation guide, and API setup
* **Presentation & Demo** -- **10 points** -- Engaging, clear explanation, and live demo

**If code doesn't run/compile you can get no more than a 60. But please write comments and a README to explain what you were trying to do.**
