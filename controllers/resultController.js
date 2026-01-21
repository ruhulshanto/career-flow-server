const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const saveResult = async (req, res) => {
    try {
        const result = req.body;
        const saved = await getCollection("results").insertOne(result);
        res.send(saved);
    } catch (error) {
        console.error("Error saving result:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getResults = async (req, res) => {
    try {
        const result = await getCollection("results").find().toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getUserResults = async (req, res) => {
    try {
        const userId = req.params.userId;
        const results = await getCollection("results").find({ userId }).toArray();
        res.send(results);
    } catch (error) {
        console.error("Error fetching user results:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const deleteResult = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await getCollection("results").deleteOne(query);
        res.send(result);
    } catch (error) {
        console.error("Error deleting result:", error);
        res.status(500).send({ error: "Server error" });
    }
};

module.exports = {
    saveResult,
    getResults,
    getUserResults,
    deleteResult,
};
