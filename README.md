# StudyBuddy

## 1. Project Description

StudyBuddy is a web application designed to help users plan and track tasks in a focused, minimal environment. The purpose is to make daily planning clearer by allowing users to quickly add tasks, set priorities, and track completion without any clutter.

This project is built with a responsive front-end, a separate back-end, and dynamic client-server communication using a JSON API.

## 2. Core Features

* **Create Task:** Add a new task with a title, priority (High, Medium, Low), and an optional due date.
* **Read Tasks:** View a list of all current tasks.
* **Update Task:** Toggle a task's status between "complete" and "incomplete".
* **Delete Task:** Remove a task from the list.
* **Responsive Design:** The UI is fully responsive and usable on both desktop and mobile viewports.

## 3. Technology Stack

As defined in the project's conception phase:

* **Front-End:**
    * HTML5
    * CSS3 (with media queries for responsiveness)
    * Vanilla JavaScript (ES6+)
* **Back-End:**
    * Node.js
    * Express.js
* **API & Data:**
    * A RESTful JSON API for all CRUD (Create, Read, Update, Delete) operations.
    * An in-memory array on the server is used for data persistence during a single session.

## 4. Installation and Setup

To run this project locally, you will need [**Node.js**](https://nodejs.org/) installed on your machine.

1.  **Download the code:**
    Download the project files and place them in a folder named `studybuddy`.

2.  **Navigate to the project directory:**
    Open your terminal and `cd` into the `studybuddy` folder.
    ```sh
    cd path/to/studybuddy
    ```

3.  **Install the required NPM packages:**
    This command reads the `package.json` file and installs the project's dependencies (`express` and `cors`).
    ```sh
    npm install
    ```

## 5. How to Run the Application

1.  **Start the server:**
    From the main `studybuddy` directory, run the following command in your terminal:
    ```sh
    node server.js
    ```

2.  **View the application:**
    Once the server is running, you will see the message: `Server is running on http://localhost:3000`.
    
    Open your web browser and go to:
    **`http://localhost:3000`**
