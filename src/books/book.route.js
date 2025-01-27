const express = require('express')
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, updateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router  = express.Router();

// frontend => backend server => controller => bookschema => database => send data to the server => back to the frontend
// post = when submit something frontend to db
// get = when get something backend from db
// put/patch = when edit or update something
// delete = when delete something

// post a book
router.post("/create-book", verifyAdminToken, postABook)

// get all books
router.get("/", getAllBooks)

//  single book endpoint
router.get("/:id", getSingleBook)

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, updateBook)

// delete a book
router.delete("/:id", verifyAdminToken, deleteABook)

module.exports = router;