const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/categories", questionController.getCategories);
router.post("/categories", questionController.createCategory);
router.get("/categories/:id", questionController.getCategoryById);
router.get("/questions/:id", questionController.getQuestionsById);

module.exports = router;
