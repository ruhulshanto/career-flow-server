const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.get("/applied-instructors", applicationController.getApplications);
router.post("/applied-instructors", applicationController.applyForInstructor);
router.delete("/applied-instructors/:id", applicationController.deleteApplication);
router.patch("/applied-instructors/:id", applicationController.updateApplicationStatus);

module.exports = router;
