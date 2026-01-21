const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const getInstructors = async (req, res) => {
    try {
        const doc = await getCollection("instructors").findOne({});
        if (!doc || !doc.categories) {
            return res.status(404).send({ message: "No categories found" });
        }

        const allInstructors = [];
        doc.categories.forEach((category) => {
            if (category.instructors) {
                Object.values(category.instructors).forEach((levelInstructors) => {
                    levelInstructors.forEach((instructor) => {
                        allInstructors.push({
                            ...instructor,
                            category: category.id,
                            categoryTitle: category.title,
                        });
                    });
                });
            }
        });

        res.send(allInstructors);
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getInstructorById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await getCollection("instructors").findOne(query);
        if (!result) {
            return res.status(404).send({ message: "Instructor not found" });
        }
        res.send(result);
    } catch (error) {
        console.error("Error fetching instructor:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getInstructorsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const doc = await getCollection("instructors").findOne({});
        if (!doc || !doc.categories) {
            return res.status(404).send({ message: "No categories found" });
        }
        const category = doc.categories.find((c) => c.id === categoryId);
        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.send({ instructors: category.instructors });
    } catch (error) {
        console.error("Error fetching instructors by category:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const createInstructor = async (req, res) => {
    try {
        const newInstructor = req.body;
        const result = await getCollection("instructors").insertOne(newInstructor);
        res.send(result);
    } catch (error) {
        console.error("Error creating instructor:", error);
        res.status(500).send({ error: "Server error" });
    }
};

module.exports = {
    getInstructors,
    getInstructorById,
    getInstructorsByCategory,
    createInstructor,
};
