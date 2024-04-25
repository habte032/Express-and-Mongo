const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;

const mongoURI = 'mongodb://localhost:27017/sampleuser';

// Connect to MongoDB
mongoose.connect(mongoURI,
    { useNewUrlParser: true,family:4})
    .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the server process on connection error
  });


// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// User Model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(cors()); 

// Create a user
app.post('/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
  });
  await user.save();
  res.status(201).json(user);
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get a user by ID
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, age }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
