// --- Global ---
// Define the base URL for our API.
const API_URL = 'http://localhost:3000/api/tasks';

// --- DOM Element Selection ---
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title');
const taskPriorityInput = document.getElementById('task-priority');
const taskDueDateInput = document.getElementById('task-due-date');
const errorMessage = document.getElementById('error-message');

// --- Functions ---

/**
 * Fetches all tasks from the API and renders them to the page.
 */
async function fetchAndRenderTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const tasks = await response.json();
        
        // Clear the current list
        taskList.innerHTML = '';
        
        // Render each task
        tasks.forEach(task => {
            renderTask(task);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        errorMessage.textContent = 'Failed to load tasks. Please try again later.';
    }
}

/**
 * Renders a single task object into the task list.
 * @param {object} task - The task object to render.
 */
function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id; // Store the task ID on the element

    li.innerHTML = `
        <div class="task-details">
            <p>${task.title}</p>
            <div>
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                ${task.dueDate ? `<span>Due: ${task.dueDate}</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-toggle" title="Toggle Complete">
                ${task.completed ? 'Undo' : '✓'}
            </button>
            <button class="btn-delete" title="Delete Task">X</button>
        </div>
    `;
    
    taskList.appendChild(li);
}

/**
 * Handles the submission of the new task form.
 * @param {Event} event - The form submission event.
 */
async function handleAddTask(event) {
    event.preventDefault(); // Stop the form from reloading the page
    
    const title = taskTitleInput.value;
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;

    // Basic client-side validation
    if (!title.trim()) {
        errorMessage.textContent = 'Task title is required.';
        return;
    }
    errorMessage.textContent = ''; // Clear error

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, priority, dueDate }),
        });

        if (response.status === 400) {
            const err = await response.json();
            errorMessage.textContent = err.error;
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const newTask = await response.json();
        renderTask(newTask); // Add the new task to the list
        
        // Clear the form
        taskTitleInput.value = '';
        taskPriorityInput.value = 'Medium';
        taskDueDateInput.value = '';

    } catch (error) {
        console.error('Error adding task:', error);
        errorMessage.textContent = 'Failed to add task. Please try again.';
    }
}

/**
 * Handles clicks on the task list (for deleting and toggling).
 * This uses event delegation to efficiently handle events.
 * @param {Event} event - The click event.
 */
async function handleListClick(event) {
    const target = event.target;
    const taskItem = target.closest('.task-item'); // Find the parent task item
    
    if (!taskItem) return; // Click wasn't on a task

    const taskId = taskItem.dataset.id;

    // --- Handle Delete ---
    if (target.classList.contains('btn-delete')) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            taskItem.remove(); // Remove the task from the UI
            
        } catch (error) {
            console.error('Error deleting task:', error);
            errorMessage.textContent = 'Failed to delete task.';
        }
    }
    
    // --- Handle Toggle Complete ---
    if (target.classList.contains('btn-toggle')) {
        try {
            const response = await fetch(`${API_URL}/${taskId}/toggle`, {
                method: 'PUT',
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle task');
            }
            
            // Re-fetch and render all tasks to show the change
            // A more optimized way would be to update just this task,
            // but this is simpler and ensures consistency.
            fetchAndRenderTasks();

        } catch (error) {
            console.error('Error toggling task:', error);
            errorMessage.textContent = 'Failed to update task.';
        }
    }
}


// --- Event Listeners ---
// Run fetchAndRenderTasks when the page first loads
document.addEventListener('DOMContentLoaded', fetchAndRenderTasks);
// Listen for the new task form submission
taskForm.addEventListener('submit', handleAddTask);
// Listen for clicks on the task list (for delete/toggle)
taskList.addEventListener('click', handleListClick);