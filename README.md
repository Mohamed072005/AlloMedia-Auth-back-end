# infodev - User Authentication Application

## Project Overview

`infodev` is a Fullstack JavaScript application for user authentication, developed as a Single Page Application (SPA) with Client-Side Rendering (CSR). The app allows users to register, log in, and manage their accounts. It includes secure password hashing and email-based account verification and password reset features. Users can log in with their email, username, or phone number.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [How to Use the Project](#how-to-use-the-project)
- [Packages Used](#packages-used)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration**: New users can register and receive a confirmation email to verify their account.
- **Email Verification**: Users must confirm their email to activate their account.
- **Password Reset**: Users can request a password reset via email.
- **Login Options**: Users can log in with their email, username, or phone number.
- **Secure Password Storage**: Passwords are securely hashed using `bcrypt`.
- **SPA Architecture**: Single Page Application for seamless user experience.
- **CSR Rendering**: Fast and efficient client-side rendering for a smooth UI experience.

## Technologies Used

- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Security**: bcrypt for secure password hashing, jsonwebtoken (JWT) for authentication
- **Email Service**: Nodemailer with Mailgen for sending email messages
- **Environment Management**: dotenv

## Setup and Installation

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v16.x or later)
- **MongoDB** (v7.x or later)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/infodev.git
   cd infodev
   ```

2. **Install dependencies:**
   ```bach
   npm install
   ```

3. **Set up environment variables:**
   ```bach
   DATABASE_URL=mongodb://localhost/allomedia
   APP_PORT=3000
   NODEJS_GMAIL_APP_USER=allomedia.media@gmail.com
   ```

4. **Start the application:**
   ```bach
   npm start
   ```

### How to Use the Project

Once the project is up and running, follow these steps to use the authentication features:

1. **User Registration**

   - Go to the /register route in your browser or Postman.
   - Provide your details (name, email, username, password, phone number).
   - After submitting the registration form, a confirmation email will be sent to your email address.
   - Click the link in the email to verify your account.

2. **Login**

   - Go to the /login route.
   - Enter your email, username, or phone number along with your password to log in.

3. **Password Reset**

   - If you forget your password, go to the /forgot-password route.
   - Enter your registered email, and a password reset link will be sent.
   - Use the link in the email to reset your password.

### Packages Used

Here’s a list of the primary packages used in this project and their roles:

- **bcrypt**: Used for hashing passwords before storing them in the database. Ensures that sensitive user data like passwords is securely encrypted.

- **dotenv**: Manages environment variables for configuration. Sensitive data such as database URLs and API keys are stored securely in a .env file.

- **express**: The core framework for building the RESTful API of the project. It handles routing, middleware, and HTTP requests.

- **express-validator**: A set of middleware that validates and sanitizes user inputs, ensuring the integrity and security of data provided in forms (e.g., registration and login).

- **jsonwebtoken**: Used for creating JSON Web Tokens (JWT), which are used to securely manage user authentication sessions, ensuring that only verified users can access protected routes.

- **mailgen**: A helper library that generates beautifully formatted HTML emails for user communication. Used in sending account verification and password reset emails.

- **mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js. It simplifies working with MongoDB by providing a schema-based solution to model the application data.

- **nodemailer**: A package that simplifies sending emails from within the application. In this project, it's used to send account verification and password reset emails to users.

- **nodemon**: A development tool that automatically restarts the server when file changes are detected. This is useful during development to see changes reflected immediately without manually restarting the server.