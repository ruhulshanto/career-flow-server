const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");

router.get("/instructors", instructorController.getInstructors);
router.post("/instructors", instructorController.createInstructor);
router.get("/instructors/:id", instructorController.getInstructorById);
router.get("/instructors-by-category/:categoryId", instructorController.getInstructorsByCategory);

module.exports = router;
