const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.get("/users/:email", userController.getUserByEmail);
router.get("/users/role/:email", userController.getUserRole);
router.get("/users/admin/:email", userController.checkAdmin);
router.put("/users/admin/:id", userController.updateUserRole);

// Admin routes
router.get("/admin/users", userController.getAdminUsers);
router.get("/admin/users/search", userController.searchUsers);
router.patch("/admin/users/:id/toggle-admin", userController.toggleAdmin);
router.get("/admin/stats", userController.getAdminStats);

module.exports = router;
