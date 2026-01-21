const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await getCollection("users").find().toArray();
        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Get user by email
const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email: email };
        const user = await getCollection("users").findOne(query);

        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Get user role by email
const getUserRole = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await getCollection("users").findOne({ email: email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ role: user.role || "user" });
    } catch (error) {
        console.error("Error fetching user role:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Check if user is admin
const checkAdmin = async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email: email };
        const user = await getCollection("users").findOne(query);

        if (user) {
            return res.send({ role: user.role || "user" });
        } else {
            return res.send({ role: "user" });
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        return res.status(500).send({ error: "Server error" });
    }
};

// Add new user (only if not exists)
const createUser = async (req, res) => {
    try {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await getCollection("users").findOne(query);

        if (existingUser) {
            return res.send({ message: "User already exists", insertedId: null });
        }

        // Add default role for new users
        const userWithRole = {
            ...user,
            role: user.role || "user",
            createdAt: new Date(),
        };

        const result = await getCollection("users").insertOne(userWithRole);
        res.send(result);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Update user role to admin (or any role)
const updateUserRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: { role: role },
        };
        const result = await getCollection("users").updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Search users by name or email
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).send({ message: "Search query is required" });
        }

        const searchRegex = new RegExp(query, "i");

        const users = await getCollection("users")
            .find({
                $or: [
                    { name: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } },
                ],
            })
            .toArray();

        res.send(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Get all users with pagination (Admin)
const getAdminUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await getCollection("users")
            .find()
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await getCollection("users").countDocuments();

        res.send({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Toggle admin role
const toggleAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const { currentUserEmail } = req.body; // To prevent self-removal

        const collection = getCollection("users");
        // Get the target user
        const targetUser = await collection.findOne({
            _id: new ObjectId(id),
        });

        if (!targetUser) {
            return res.status(404).send({ message: "User not found" });
        }

        // Prevent user from removing their own admin role
        if (targetUser.email === currentUserEmail) {
            return res
                .status(400)
                .send({ message: "You cannot change your own admin role" });
        }

        const newRole = targetUser.role === "admin" ? "user" : "admin";

        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: { role: newRole },
        };

        const result = await collection.updateOne(filter, updateDoc);

        res.send({
            ...result,
            newRole,
            message: `User role updated to ${newRole} successfully`,
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ error: "Server error" });
    }
};

// Get admin stats
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await getCollection("users").countDocuments();
        const totalAdmins = await getCollection("users").countDocuments({
            role: "admin",
        });
        const totalResults = await getCollection("results").countDocuments();
        const totalApplications = await getCollection(
            "appliedInstructors"
        ).countDocuments();

        res.send({
            totalUsers,
            totalAdmins,
            totalResults,
            totalApplications,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).send({ error: "Server error" });
    }
};

module.exports = {
    getUsers,
    getUserByEmail,
    getUserRole,
    checkAdmin,
    createUser,
    updateUserRole,
    searchUsers,
    getAdminUsers,
    toggleAdmin,
    getAdminStats,
};
