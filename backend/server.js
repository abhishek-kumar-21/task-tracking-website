const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Connect to MongoDB
client.connect()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const dbName = process.env.DB_NAME;
const app = express();
const port = 3000;

app.use(bodyparser.json());
app.use(cors());

// -------------------------
// CRUD Endpoints for Tasks
// -------------------------

// ✅ READ ALL Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('tasks');
    const tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
});

// ✅ CREATE Task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = req.body;
    const db = client.db(dbName);
    const collection = db.collection('tasks');
    task.createdAt = new Date();
    task.isCompleted = task.isCompleted || false;

    const result = await collection.insertOne(task);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
});

// ✅ READ ONE Task by ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);
    const collection = db.collection('tasks');
    const task = await collection.findOne({ _id: new ObjectId(id) });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ success: false, message: "Failed to fetch task" });
  }
});

// ✅ UPDATE Task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id; // ✅ Prevent updating immutable _id field

    const db = client.db(dbName);
    const collection = db.collection('tasks');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
});

// ✅ DELETE Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db(dbName);
    const collection = db.collection('tasks');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
});

// -------------------------

app.listen(port, () => {
  console.log(`🚀 Task Manager backend running at http://localhost:${port}`);
});
