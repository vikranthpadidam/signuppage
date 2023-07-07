const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const url = process.env.MONGODB_URL;


// Connect to MongoDB Atlas
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.log('Failed to connect to MongoDB Atlas', error);
});

// Define a schema for the user
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Serve the sign-in page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Define a route to handle sign-in requests
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Create a new user instance
  const newUser = new User({ username, password });

  // Save the user to the database
  newUser.save()
    .then(() => {
      res.status(200).send('User signed in successfully');
    })
    .catch((error) => {
      res.status(500).send('Failed to sign in user');
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
