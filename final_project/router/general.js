const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new userpublic_users.get('/', async (req, res) => {

public_users.get('/', async (req, res) => {
  try {
    // Simulate fetching data using axios (replace with the actual API URL)
    const response = await axios.get('/books');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Getting book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    // Simulate fetching book details by ISBN using axios (replace with the actual API URL)
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Task 12: Getting book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    // Simulate fetching books by author using axios (replace with the actual API URL)
    const response = await axios.get(`http://localhost:5000/books?author=${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this author", error: error.message });
  }
});

// Task 13: Getting book details based on title using async-await
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    // Simulate fetching books by title using axios (replace with the actual API URL)
    const response = await axios.get(`http://localhost:5000/books?title=${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found with this title", error: error.message });
  }
});
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Check if the user already exists
    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    // Register the new user
    users[username] = { password };
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      // Simulate fetching data using axios
      const response = await axios.get('/books'); // Replace with actual API URL
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
