const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {

    let filteredUsers = users.filter(
      user => user.username === username
    );
  
    return filteredUsers.length === 0;
  
  }

  const authenticatedUser = (username, password) => {

    let validUsers = users.filter(
      user => user.username === username && user.password === password
    );
  
    return validUsers.length > 0;
  
  }

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({
        message: "Error logging in"
      });
    }
  
    if (authenticatedUser(username, password)) {
  
      let accessToken = jwt.sign(
        {
          data: username
        },
        "access",
        {
          expiresIn: 60 * 60
        }
      );
  
      req.session.authorization = {
        accessToken
      };
  
      return res.status(200).json({
        message: "Login successful!"
    });
  
    }
  
    return res.status(208).json({
      message: "Invalid Login. Check username and password"
    });
  
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
  
    const review = req.query.review;
  
    const username = req.user.data;
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review successfully added/updated",
      reviews: books[isbn].reviews
    });
  
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
  
    const username = req.user.data;
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review successfully deleted",
      reviews: books[isbn].reviews
    });
  
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
