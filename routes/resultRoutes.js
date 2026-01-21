const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

router.get("/results", resultController.getResults);
router.post("/results", resultController.saveResult);
router.get("/results/:userId", resultController.getUserResults);
router.delete("/results/:id", resultController.deleteResult);

module.exports = router;
