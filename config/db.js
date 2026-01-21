const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0l8ijlq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db("careerQuestions");
        console.log("Connected to MongoDB Atlas successfully!");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error("Database not initialized");
    }
    return db;
};

const getCollection = (collectionName) => {
    return getDb().collection(collectionName);
};

module.exports = { connectDB, getDb, getCollection, client };
