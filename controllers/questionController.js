const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const getCategories = async (req, res) => {
    try {
        const result = await getCollection("questions").find().toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await getCollection("questions").findOne(query);
        if (!result) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.send(result);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const createCategory = async (req, res) => {
    try {
        const newQuestion = req.body;
        const result = await getCollection("questions").insertOne(newQuestion);
        res.send(result);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getQuestionsById = async (req, res) => {
    try {
        const id = req.params.id;
        // Note: Logic in original index.js was findOne({}) then finding category inside.
        // Line 288: const doc = await studentCareerQuestions.findOne({});
        // It seems 'questions' collection might have a single document with categories array?
        // Or maybe it finds 'one' but there are multiple?
        // Original code: await studentCareerQuestions.findOne({});
        // This gets the *first* document in the collection.

        const doc = await getCollection("questions").findOne({});
        if (!doc || !doc.categories) {
            return res.status(404).send({ message: "No categories found" });
        }
        const category = doc.categories.find((c) => c.id === id);
        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }
        res.send({ questions: category.questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).send({ error: "Server error" });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    getQuestionsById,
};
