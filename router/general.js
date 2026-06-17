const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register user
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Unable to register user."
        });
    }

    if (!isValid(username)) {
        return res.status(404).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });

});

// Task 1
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10 - Promise callback
public_users.get('/books', function (req, res) {

    axios.get('http://localhost:5000/')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({
                message: "Error fetching books"
            });
        });

});

// Task 2
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});

// Task 11 - Promise callback
public_users.get('/promise/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({
                message: "Error fetching ISBN"
            });
        });

});

// Task 3
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const bookKeys = Object.keys(books);

    let matchedBooks = [];

    bookKeys.forEach(key => {
        if (books[key].author === author) {
            matchedBooks.push(books[key]);
        }
    });

    return res.status(200).json(matchedBooks);

});

// Task 12 - Promise callback
public_users.get('/promise/author/:author', function (req, res) {

    const author = req.params.author;

    axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    )
    .then(response => {
        res.status(200).json(response.data);
    })
    .catch(error => {
        res.status(500).json({
            message: "Error fetching books by author"
        });
    });

});

// Task 4
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const bookKeys = Object.keys(books);

    let matchedBooks = [];

    bookKeys.forEach(key => {
        if (books[key].title === title) {
            matchedBooks.push(books[key]);
        }
    });

    return res.status(200).json(matchedBooks);

});

// Task 13 - Promise callback
public_users.get('/promise/title/:title', function (req, res) {

    const title = req.params.title;

    axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    )
    .then(response => {
        res.status(200).json(response.data);
    })
    .catch(error => {
        res.status(500).json({
            message: "Error fetching books by title"
        });
    });

});

// Task 5
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});

module.exports.general = public_users;