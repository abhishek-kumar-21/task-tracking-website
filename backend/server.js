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
  const db = client.db(dbName);
  const collection = db.collection('tasks');
  const tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
  res.json(tasks);
});

// ✅ CREATE Task
app.post('/api/tasks', async (req, res) => {
  const task = req.body;
  const db = client.db(dbName);
  const collection = db.collection('tasks');
  task.createdAt = new Date();
  task.isCompleted = false;
  const result = await collection.insertOne(task);
  res.json({ success: true, insertedId: result.insertedId });
});

// ✅ READ ONE Task by ID
app.get('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const db = client.db(dbName);
  const collection = db.collection('tasks');
  const task = await collection.findOne({ _id: new ObjectId(id) });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// ✅ UPDATE Task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = client.db(dbName);
  const collection = db.collection('tasks');
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  res.json({ success: true, result });
});

// ✅ DELETE Task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const db = client.db(dbName);
  const collection = db.collection('tasks');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true, result });
});

// -------------------------

app.listen(port, () => {
  console.log(`🚀 Task Manager backend running at http://localhost:${port}`);
});
