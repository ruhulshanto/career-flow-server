require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0l8ijlq.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    
    // await client.connect();

    const userCollection = client.db("careerQuestions").collection("users");
    const studentCareerQuestions = client
      .db("careerQuestions")
      .collection("questions");
    const resultCollection = client.db("careerQuestions").collection("results");
    const instructorCollection = client
      .db("careerQuestions")
      .collection("instructors");
    const appliedInstructorCollection = client
      .db("careerQuestions")
      .collection("appliedInstructors");
    const booksCollection = client.db("careerQuestions").collection("books");

    // ---------------- USERS ----------------

    // Get all users
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // Get user by email
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);

        if (user) {
          res.send(user);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ error: "Server error" });
      }
    });

    // Add new user (only if not exists) example: { __Google-SignIn___}
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await userCollection.findOne(query);

        if (existingUser) {
          return res.send({ message: "User already exists", insertedId: null });
        }

        // Add default role for new users
        const userWithRole = {
          ...user,
          role: user.role || "user",
          createdAt: new Date(),
        };

        const result = await userCollection.insertOne(userWithRole);
        res.send(result);
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ error: "Server error" });
      }
    });

    // Check if user is admin
    app.get("/users/admin/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);

        if (user) {
          return res.send({ role: user.role || "user" });
        } else {
          return res.send({ role: "user" });
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        return res.status(500).send({ error: "Server error" });
      }
    });

    // Update user role to admin (or any role)
    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const { role } = req.body; // { role: "admin" }
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { role: role },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // ---------------- QUESTIONS ----------------
    app.get("/categories", async (req, res) => {
      const result = await studentCareerQuestions.find().toArray();
      res.send(result);
    });

    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentCareerQuestions.findOne(query);
      if (!result) {
        return res.status(404).send({ message: "Category not found" });
      }
      res.send(result);
    });

    app.post("/categories", async (req, res) => {
      const newQuestion = req.body;
      const result = await studentCareerQuestions.insertOne(newQuestion);
      res.send(result);
    });

    app.get("/questions/:id", async (req, res) => {
      const id = req.params.id;
      const doc = await studentCareerQuestions.findOne({});
      if (!doc || !doc.categories) {
        return res.status(404).send({ message: "No categories found" });
      }
      const category = doc.categories.find((c) => c.id === id);
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }
      res.send({ questions: category.questions });
    });

    // ---------------- RESULTS ----------------
    app.post("/results", async (req, res) => {
      const result = req.body;
      const saved = await resultCollection.insertOne(result);
      res.send(saved);
    });

    app.get("/results", async (req, res) => {
      const result = await resultCollection.find().toArray();
      res.send(result);
    });

    app.get("/results/:userId", async (req, res) => {
      const userId = req.params.userId;
      const results = await resultCollection.find({ userId }).toArray();
      res.send(results);
    });

    app.delete("/results/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await resultCollection.deleteOne(query);
      res.send(result);
    });

    // ---------------- INSTRUCTORS ----------------
    

    app.get("/instructors", async (req, res) => {
      const doc = await instructorCollection.findOne({});
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
    });

    app.get("/instructors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await instructorCollection.findOne(query);
      if (!result) {
        return res.status(404).send({ message: "Instructor not found" });
      }
      res.send(result);
    });

    app.get("/instructors-by-category/:categoryId", async (req, res) => {
      const { categoryId } = req.params;
      const doc = await instructorCollection.findOne({});
      if (!doc || !doc.categories) {
        return res.status(404).send({ message: "No categories found" });
      }
      const category = doc.categories.find((c) => c.id === categoryId);
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }
      res.send({ instructors: category.instructors });
    });

    app.post("/instructors", async (req, res) => {
      const newInstructor = req.body;
      const result = await instructorCollection.insertOne(newInstructor);
      res.send(result);
    });

    // ---------------- APPLIED INSTRUCTORS ----------------
    // Apply for instructor endpoint
    app.post("/applied-instructors", async (req, res) => {
      const application = req.body;
      const result = await appliedInstructorCollection.insertOne(application);
      res.send(result);
    });

    // Get all applications endpoint
    app.get("/applied-instructors", async (req, res) => {
      const applications = await appliedInstructorCollection.find().toArray();
      res.send(applications);
    });

    // Delete application endpoint
    app.delete("/applied-instructors/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await appliedInstructorCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).send({ error: "Failed to delete application" });
      }
    });

    // Update application status endpoint
    app.patch("/applied-instructors/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status: status },
        };
        const result = await appliedInstructorCollection.updateOne(
          filter,
          updateDoc
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).send({ error: "Failed to update application" });
      }
    });

    // ---------------- BOOKS ----------------

    // Get all books
    app.get("/books", async (req, res) => {
      try {
        const result = await booksCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send({ error: "Failed to fetch books" });
      }
    });

    // Get single book by id
    app.get("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: "Book not found" });
        }
        res.send(result);
      } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).send({ error: "Failed to fetch book" });
      }
    });

    // Get books by category ID
    app.get("/books-by-category/:categoryId", async (req, res) => {
      try {
        const { categoryId } = req.params;
        const doc = await booksCollection.findOne({});

        if (!doc || !doc.categories) {
          return res.status(404).send({ message: "No categories found" });
        }

        const category = doc.categories.find((c) => c.id === categoryId);
        if (!category) {
          return res.status(404).send({ message: "Category not found" });
        }

        res.send({ books: category.books });
      } catch (error) {
        console.error("Error fetching books by category:", error);
        res.status(500).send({ error: "Failed to fetch books" });
      }
    });

    // Get books by category and level
    app.get("/books/:categoryId/:level", async (req, res) => {
      try {
        const { categoryId, level } = req.params;
        const doc = await booksCollection.findOne({});

        if (!doc || !doc.categories) {
          return res.status(404).send({ message: "No categories found" });
        }

        const category = doc.categories.find((c) => c.id === categoryId);
        if (!category) {
          return res.status(404).send({ message: "Category not found" });
        }

        const books = category.books?.[level] || [];
        res.send({ books, category: category.title });
      } catch (error) {
        console.error("Error fetching books by category and level:", error);
        res.status(500).send({ error: "Failed to fetch books" });
      }
    });

    // Add new book
    app.post("/books", async (req, res) => {
      try {
        const newBook = req.body;
        const result = await booksCollection.insertOne(newBook);
        res.send(result);
      } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).send({ error: "Failed to add book" });
      }
    });

    // Update book
    app.put("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedBook = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: updatedBook,
        };
        const result = await booksCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send({ error: "Failed to update book" });
      }
    });

    // Delete book
    app.delete("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send({ error: "Failed to delete book" });
      }
    });

    // Get all books across all categories (flattened)
    app.get("/all-books", async (req, res) => {
      try {
        const doc = await booksCollection.findOne({});
        if (!doc || !doc.categories) {
          return res.status(404).send({ message: "No books found" });
        }

        const allBooks = [];
        doc.categories.forEach((category) => {
          if (category.books) {
            Object.entries(category.books).forEach(([level, books]) => {
              books.forEach((book) => {
                allBooks.push({
                  ...book,
                  category: category.id,
                  categoryTitle: category.title,
                  level: level,
                });
              });
            });
          }
        });

        res.send(allBooks);
      } catch (error) {
        console.error("Error fetching all books:", error);
        res.status(500).send({ error: "Failed to fetch books" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(" Connected to MongoDB Atlas successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Career Flow Server is running!");
});

app.listen(port, () => {
  console.log(` Server is running at http://localhost:${port}`);
});
