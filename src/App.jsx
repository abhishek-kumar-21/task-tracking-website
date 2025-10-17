import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import axios from 'axios';

const API_URL = "http://localhost:3000/api/tasks";
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  });
  const [editingId, setEditingId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [detailTask, setDetailTask] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ✅ Load tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        setTasks(res.data);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Reset form
  const resetForm = () =>
    setForm({ title: '', description: '', dueDate: '', priority: 'Medium' });

  // ✅ Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      if (editingId) {
        // Update existing task
        await axios.put(`${API_URL}/${editingId}`, form);
        setTasks(tasks.map((t) => (t._id === editingId ? { ...t, ...form } : t)));
        setEditingId(null);
      } else {
        // Create new task
        const res = await axios.post(API_URL, form);
        const newTask = { _id: res.data.insertedId, ...form, isCompleted: false };
        setTasks([newTask, ...tasks]);
      }
      resetForm();
    } catch (err) {
      console.error("❌ Error saving task:", err);
    }
  };

  // ✅ Start editing
  const startEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'Medium',
    });
    setEditingId(task._id);
    setDetailTask(null);
  };

  // ✅ Delete a task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setConfirmDeleteId(null);
      if (detailTask?._id === id) setDetailTask(null);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
    }
  };

  // ✅ Toggle task completion
  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    const updated = { ...task, isCompleted: !task.isCompleted };

    try {
      await axios.put(`${API_URL}/${id}`, updated);
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error toggling task:", err);
    }
  };

  const filteredTasks = tasks.filter((t) => showCompleted || !t.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex justify-center px-4 mt-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Task Manager
          </h1>

          {/* Form: Create / Update */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Task title (required)"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 min-h-[72px] focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  {editingId ? 'Update Task' : 'Add Task'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      resetForm();
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={() => setShowCompleted((s) => !s)}
                    className="w-4 h-4"
                  />
                  Show Completed
                </label>
                <span className="text-xs">({filteredTasks.length} shown)</span>
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="border-t my-5" />

          {/* Tasks List */}
          <h2 className="text-lg font-semibold mb-3">Your Tasks</h2>
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">No tasks to show. Create one above!</p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => toggleComplete(task._id)}
                      className="mt-1"
                    />
                    <div>
                      <div
                        className={`font-medium ${
                          task.isCompleted ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'} •{' '}
                        {task.priority} priority
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetailTask(task)}
                      className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => startEdit(task)}
                      title="Edit"
                      className="p-2 rounded-md hover:bg-indigo-50"
                    >
                      <FaEdit className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(task._id)}
                      title="Delete"
                      className="p-2 rounded-md hover:bg-red-50"
                    >
                      <AiFillDelete className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 mx-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{detailTask.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {detailTask.dueDate
                    ? `Due: ${detailTask.dueDate}`
                    : 'No due date'}{' '}
                  • {detailTask.priority}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(detailTask)}
                  className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDetailTask(null)}
                  className="px-3 py-2 rounded-md bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 text-gray-700 whitespace-pre-wrap">
              {detailTask.description ? (
                detailTask.description
              ) : (
                <i>No description provided.</i>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmDeleteId(detailTask._id);
                  setDetailTask(null);
                }}
                className="px-3 py-2 rounded-md bg-red-50 text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold">Delete task?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to permanently delete this task?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-3 py-2 rounded-md bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
