const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const getBooks = async (req, res) => {
    try {
        const result = await getCollection("books").find().toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send({ error: "Failed to fetch books" });
    }
};

const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await getCollection("books").findOne(query);
        if (!result) {
            return res.status(404).send({ message: "Book not found" });
        }
        res.send(result);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).send({ error: "Failed to fetch book" });
    }
};

const getBooksByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log("Fetching books for category:", categoryId);

        const doc = await getCollection("books").findOne({});

        if (!doc) {
            return res.status(404).send({
                message: "No books database found",
                books: {},
            });
        }

        if (!doc.categories || !Array.isArray(doc.categories)) {
            return res.status(404).send({
                message: "No categories found in books database",
                books: {},
            });
        }

        const category = doc.categories.find((c) => c.id === categoryId);

        if (!category) {
            return res.status(404).send({
                message: `Category '${categoryId}' not found`,
                books: {},
                availableCategories: doc.categories.map((c) => ({
                    id: c.id,
                    title: c.title,
                })),
            });
        }

        const books = category.books || {
            level1: [],
            level2: [],
            level3: [],
        };

        res.send({
            books: books,
            category: category.title,
            message: `Found books for ${category.title}`,
        });
    } catch (error) {
        console.error("Error fetching books by category:", error);
        res.status(500).send({
            error: "Failed to fetch books",
            books: {},
        });
    }
};

module.exports = {
    getBooks,
    getBookById,
    getBooksByCategory,
};
