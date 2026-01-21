const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const applyForInstructor = async (req, res) => {
    try {
        const application = req.body;
        const result = await getCollection("appliedInstructors").insertOne(application);
        res.send(result);
    } catch (error) {
        console.error("Error applying for instructor:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const getApplications = async (req, res) => {
    try {
        const applications = await getCollection("appliedInstructors").find().toArray();
        res.send(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({ error: "Server error" });
    }
};

const deleteApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await getCollection("appliedInstructors").deleteOne(query);
        res.send(result);
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).send({ error: "Failed to delete application" });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: { status: status },
        };
        const result = await getCollection("appliedInstructors").updateOne(
            filter,
            updateDoc
        );
        res.send(result);
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).send({ error: "Failed to update application" });
    }
};

module.exports = {
    applyForInstructor,
    getApplications,
    deleteApplication,
    updateApplicationStatus,
};
