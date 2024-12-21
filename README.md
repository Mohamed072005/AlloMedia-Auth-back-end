# AlloMedia-Auth-back-end - User Authentication Application

## Project Overview

`AlloMedia-back-end` is a Fullstack JavaScript application for user authentication, developed as a Single Page Application (SPA) with Client-Side Rendering (CSR). The app allows users to register, log in, and manage their accounts. It includes secure password hashing and email-based account verification and password reset features. Users can log in with their email, username, or phone number.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [How to Use the Project](#how-to-use-the-project)
- [Packages Used](#packages-used)
- [Environment Variables](#environment-variables)
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

- If you forget your password, go to the /ask/reset/password route.
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

- **ejs**: EJS (Embedded JavaScript) is a simple templating engine that allows you to generate HTML markup with plain JavaScript. It helps to embed dynamic data into HTML pages in your Node.js application.

- **express-session**: is middleware for managing sessions in Express.js. It allows you to store session data on the server and assign each session a unique ID, which is stored in a cookie. It's useful for managing user-specific data like authentication tokens, shopping carts, etc.

### Environment Variables

The application uses the following environment variables:

- `DATABASE_URL`: The URL of the MongoDB database instance. This should be the connection string to your database.
- `APP_PORT`: The port on which the application will run. Default is `3000`.
- `NODEJS_GMAIL_APP_USER`: The Gmail account email used for sending application-related emails, such as password resets and notifications.
- `NODEJS_GMAIL_APP_PASSWORD`: The password or app-specific password for the Gmail account. Ensure this value is securely stored.
- `TOKEN_SECRET`: The secret key used to sign and verify JSON Web Tokens (JWT) for authentication and password reset functionality. This should be a strong, secure string.

Make sure to create a `.env` file in your project root and include these variables with appropriate values for your environment.

### Contributing

We welcome contributions to improve this project! To contribute, follow the steps below:

#### 1. Fork the Repository
- Click the "Fork" button at the top right of this repository page.
- This will create a copy of the repository under your GitHub account.

#### 2. Clone Your Fork
- Clone the forked repository to your local machine.

   ```bash
   git clone https://github.com/your-username/allomedia.git
   ```

#### 3. Create a New Branch
-Create a new branch for your feature or bugfix.

   ```bach
   git checkout -b your-branch-name
   ```

#### 4. Make Changes
- Implement your feature, fix a bug, or make any improvements. Make sure to follow the coding style and best practices used in the project.

#### 5.Commit and Push Your Changes
- Commit your changes with a descriptive message.

   ```bach
   git add .
   git commit -m "Description of changes"
   git push origin your-branch-name
   ```

#### 6. Submit a Pull Request
- Go to the original repository and click the "Pull Request" button.
- Make sure to provide a clear description of your changes in the pull request, referencing any issues or feature requests you're addressing.
