const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
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

// Task 1 - Get all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10 - Get all books using Async/Await and Axios
public_users.get('/async/books', async function (req, res) {

    try {

        const response = await axios.get('http://localhost:5000/');

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books"
        });

    }

});

// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});

// Task 11 - Get book by ISBN using Async/Await and Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching book by ISBN"
        });

    }

});

// Task 3 - Get books by author
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

// Task 12 - Get books by author using Async/Await and Axios
public_users.get('/async/author/:author', async function (req, res) {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books by author"
        });

    }

});

// Task 4 - Get books by title
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

// Task 13 - Get books by title using Async/Await and Axios
public_users.get('/async/title/:title', async function (req, res) {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books by title"
        });

    }

});

// Task 5 - Get book reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});

module.exports.general = public_users;