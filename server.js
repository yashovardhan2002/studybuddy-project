// Import required modules
const express = require('express');
const cors = require('cors');
// --- NEW: Import File System and Path modules for data persistence ---
const fs = require('fs');
const path = require('path');

// Create an instance of express
const app = express();
const PORT = 3000;

// --- NEW: Define the path for the data file ---
const DATA_FILE = path.join(__dirname, 'tasks.json');

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all
// routes
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());
// Serve static files (HTML, CSS, JS) from the 'public'
// directory
app.use(express.static('public'));

// --- In-Memory Database ---
// We use a simple array to store tasks, as proposed in
// Phase 1.
// A real app would use a database (like MongoDB or
// PostgreSQL).
let tasks = [
    { id: 1, title: 'Complete Phase 2', priority: 'High',
dueDate: '2025-11-10', completed: false },
    { id: 2, title: 'Record Screencast', priority:
'Medium', dueDate: '2025-11-12', completed: false }
];
let nextTaskId = 3; // Counter for new task IDs

// --- NEW: Persistence Logic ---
// Check if a data file exists. If it does, load data from it.
// If not, we use the hardcoded tasks above and create the file.
if (fs.existsSync(DATA_FILE)) {
    try {
        const fileData = fs.readFileSync(DATA_FILE);
        tasks = JSON.parse(fileData);
        // Update the ID counter so we don't duplicate IDs
        if (tasks.length > 0) {
            nextTaskId = Math.max(...tasks.map(t => t.id)) + 1;
        }
    } catch (error) {
        console.error("Error reading data file, using default tasks.");
    }
} else {
    // Save the initial default tasks to the file so it exists next time
    saveTasks();
}

// --- NEW: Helper function to save tasks to the file ---
function saveTasks() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// --- API Routes (Endpoints) ---

/**
 * GET /api/tasks
 * Fetches all tasks.
 */
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

/**
 * POST /api/tasks
 * Creates a new task.
 * Expects { title, priority, dueDate } in the request
// body.
 */
app.post('/api/tasks', (req, res) => {
    const { title, priority, dueDate } = req.body;

    // Server-side validation (as mentioned in P1)
    if (!title) {
        return res.status(400).json({ error:
'Task title is required.' });
    }

    // Create new task object
    const newTask = {
        id: nextTaskId++,
        title: title,
        priority: priority || 'Medium',
        dueDate: dueDate || null,
        completed: false
    };

    // Add to our in-memory array
    tasks.push(newTask);

    // --- NEW: Save changes to file ---
    saveTasks();

    // Send the new task back with a 201 (Created)
// status
    res.status(201).json(newTask);
});

/**
 * PUT /api/tasks/:id/toggle
 * Toggles the 'completed' status of a task.
 */
app.put('/api/tasks/:id/toggle', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        task.completed = !task.completed;
        
        // --- NEW: Save changes to file ---
        saveTasks();

        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found.' });
    }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task by its ID.
 */
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id
=== taskId);

    if (taskIndex !== -1) {
        // Remove the task from the
// array
        tasks.splice(taskIndex, 1);
        
        // --- NEW: Save changes to file ---
        saveTasks();

        // Send a 204 (No Content)
// status to confirm deletion
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Task not found.' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on
http://localhost:${PORT}`);
});
