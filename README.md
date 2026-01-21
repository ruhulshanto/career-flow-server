CareerFlow Backend Server
📡 Server Overview
The CareerFlow backend is a Node.js + Express.js + MongoDB RESTful API that powers the CareerFlow platform. It handles authentication, user management, instructor applications, book recommendations, and more.

🛠 Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB (with Mongoose-like native driver)

Authentication: Firebase (client-side) + role-based middleware

Environment Management: dotenv

📁 Project Structure
text
career-flow-server/
├── index.js              # Main server entry point
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (ignored in Git)
├── .gitignore
└── README.md
⚙️ Installation & Setup
1. Clone the Repository
bash
git clone https://github.com/your-username/career-flow-server.git
cd career-flow-server
2. Install Dependencies
bash
npm install
3. Environment Configuration
Create a .env file in the root directory and add:

env
PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
4. Run the Server
Development (with auto-reload):

bash
npx nodemon index.js
Production:

bash
node index.js
The server will run at: http://localhost:5000

🚀 API Endpoints
Method	Endpoint	Description	Protected
GET	/	Health check	No
GET	/users	Get all users	Admin
GET	/users/:email	Get user by email	Yes
POST	/users	Create new user (Google Sign-In)	No
GET	/admin/users	Get users with pagination	Admin
PATCH	/admin/users/:id/toggle-admin	Toggle admin role	Admin
GET	/admin/stats	Get platform statistics	Admin
GET	/categories	Get all career categories	No
GET	/books-by-category/:categoryId	Get books by category	No
POST	/applied-instructors	Submit instructor application	Yes
GET	/applied-instructors	Get all applications	Admin
PATCH	/applied-instructors/:id	Update application status	Admin
DELETE	/applied-instructors/:id	Delete application	Admin
POST	/results	Save career test results	Yes
GET	/results/:userId	Get user's results	Yes
🔒 Security & Validation
CORS enabled for frontend origin only

Input validation on all POST/PATCH routes

Role-based middleware for admin routes

MongoDB ObjectId validation

Environment variables for sensitive data

🧪 Testing the API
You can test endpoints using Postman or cURL:

bash
# Example: Get all books for "software" category
curl http://localhost:5000/books-by-category/software

# Example: Get admin stats (requires admin token)
curl -H "Authorization: Bearer <token>" http://localhost:5000/admin/stats
📦 Dependencies
express – Web framework

mongodb – Native MongoDB driver

cors – Cross-Origin Resource Sharing

dotenv – Environment variable management

Dev Dependencies:

nodemon – Auto-restart in development

🌐 Deployment
The server is deployed on Render / Vercel / Cyclic (or similar Node.js hosting).
Ensure environment variables are set in your hosting platform.

🐛 Troubleshooting
Issue	Solution
MongoDB connection fails	Check .env credentials and network access
Port already in use	Change PORT in .env or kill process on port 5000
CORS errors	Verify frontend origin in cors() configuration
Admin routes return 403	Ensure user has role: "admin" in database
📄 License
MIT License – see LICENSE for details.

🙏 Acknowledgments
MongoDB Atlas for database hosting

Express.js team for the robust framework

Firebase for authentication integration

🔗 Connect Frontend & Backend
The frontend (React) is configured to call this backend API.
Update the API base URL in the frontend’s axios configuration if needed.
