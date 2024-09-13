const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'john_doe', password: 'password123' },
  { username: 'jane_doe', password: 'password456' }
];

// Secret key for JWT
const JWT_SECRET = "your_jwt_secret_key";

// Function to validate if a user exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to authenticate user based on username and password
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Returns true if user is found
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ message: "Logged in successfully", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
});
// Delete a book review by the logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.headers.authorization.split(' ')[1]; // Extract the JWT token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access, no token provided" });
    }
  
    try {
      // Verify the JWT token to get the username
      const decoded = jwt.verify(token, JWT_SECRET);
      const username = decoded.username;
  
      // Check if the book exists
      if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Check if the user has posted a review
      const reviews = books[isbn].reviews;
      if (!reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
      }
  
      // Delete the user's review
      delete reviews[username];
  
      return res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token or unauthorized access" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

