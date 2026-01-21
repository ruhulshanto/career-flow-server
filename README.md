🚀 CareerFlow — Server Side (Backend)

📖 Overview
This is the backend server for the CareerFlow web application.  
It is responsible for handling authentication, authorization, API endpoints, CRUD operations, and database communication.

The server is built using Node.js and Express.js and connects to MongoDB Atlas for data storage.  
JWT-based authentication is used to secure protected routes, while Firebase Authentication is used on the client side.

---

🛠️ Tech Stack

• Backend Runtime: Node.js  
• Framework: Express.js  
• Database: MongoDB (MongoDB Atlas)  
• Authentication: JWT (JSON Web Token)  
• Middleware: CORS, dotenv  
• Development Tool: Nodemon  

---

📂 Project Structure

career-flow-server/
├── index.js
├── package.json
├── .env
├── middleware/
│   ├── verifyJWT.js
│   └── verifyAdmin.js
├── routes/
│   ├── users.route.js
│   ├── instructors.route.js
│   ├── books.route.js
│   └── admin.route.js
└── utils/
    └── dbConnect.js

---

🔐 Environment Variables

Create a `.env` file in the project root and add the following:

PORT=5000  
DB_URI=your_mongodb_connection_string  
ACCESS_TOKEN_SECRET=your_jwt_secret_key  

⚠️ Never push your `.env` file to GitHub.

---

🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm
- MongoDB Atlas account

---

### Installation

```bash
git clone https://github.com/your-username/career-flow-server.git
cd career-flow-server
npm install
