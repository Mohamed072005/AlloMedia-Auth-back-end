require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require("./routes/auth.router");
const port = process.env.APP_PORT || 3000;

//db connection
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//middleware for parce the request bodu to json
app.use(express.json())

//routers
app.use(authRouter);

if (require.main === module) {
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;