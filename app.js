require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const authRouter = require("./routes/auth.router");
const userRouter = require('./routes/user.router');
const port = process.env.APP_PORT || 3000;

//db connection
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

//middleware for parce the request bodu to json
app.use(express.json())


app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3000000
  }
}))

//routers
app.use(authRouter);
app.use(userRouter);



if (require.main === module) {
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;