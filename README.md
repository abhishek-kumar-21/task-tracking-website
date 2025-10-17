## 🧾 Task Manager — MERN CRUD Application

A full-stack **Task Tracking Web Application** built using the **MERN stack (MongoDB, Express, React, Node.js)**.

This app allows users to:

* ✅ Create new tasks
* ✏️ Update existing tasks
* 👁️ View task list and details
* ❌ Delete tasks
* 📅 Add description, due date, and priority for each task
* ✅ Mark tasks as completed / pending

---

## 🚀 Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| **Frontend**    | React + Vite + Tailwind CSS |
| **Backend**     | Node.js + Express           |
| **Database**    | MongoDB                     |
| **HTTP Client** | Axios                       |
| **Icons**       | React Icons                 |


## ⚙️ Setup Instructions

### 🧩 1. Clone the repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

---

### 🗄️ 2. Setup the backend (Express + MongoDB)

```bash
cd server
npm install
```

Create a `.env` file inside `/server` directory and add:

```env
PORT=3000
MONGO_URI=mongodb+srv://<your-mongo-connection-string>
DB_NAME=taskmanager
```

Then run the server:

```bash
node server.js
```

If setup is correct, you’ll see:

```
Server running on http://localhost:3000
Connected to MongoDB
```

---

### 💻 3. Setup the frontend (React + Vite)

Open another terminal window:

```bash
cd client
npm install
npm run dev
```

This starts the frontend at:

👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🌐 API Endpoints (Backend)

Base URL: `http://localhost:3000/api/tasks`

| Method     | Endpoint         | Description         |
| ---------- | ---------------- | ------------------- |
| **GET**    | `/api/tasks`     | Fetch all tasks     |
| **POST**   | `/api/tasks`     | Create a new task   |
| **PUT**    | `/api/tasks/:id` | Update a task by ID |
| **DELETE** | `/api/tasks/:id` | Delete a task by ID |

### Example Task Object

```json
{
  "_id": "67109d67a1b5f92c8c79d312",
  "title": "Finish assignment",
  "description": "Complete MERN task tracker app",
  "dueDate": "2025-10-20",
  "priority": "High",
  "isCompleted": false
}
```

---

## 🧠 Key Features

* CRUD operations with MongoDB
* Responsive UI with Tailwind CSS
* Task detail modal and edit form
* Priority and due date management
* Toggle task completion
* Clean, brand-free interface for academic use
