const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/books", bookController.getBooks);
router.get("/books/:id", bookController.getBookById);
router.get("/books-by-category/:categoryId", bookController.getBooksByCategory);

module.exports = router;
