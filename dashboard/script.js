// =========================
// TaskFlow Dashboard
// =========================


// =========================
// Current User
// =========================

const currentUser = JSON.parse(
    localStorage.getItem('taskflowCurrentUser')
);


// =========================
// Protect Dashboard
// =========================

if (!currentUser) {

    window.location.href =
        '../login/index.html';

}


// =========================
// Task State
// =========================

let tasks = [];

let selectedTaskId = null;

let currentView = 'dashboard';


// =========================
// DOM Elements
// =========================

const addTaskButton =
    document.querySelector('#addTaskBtn');

const taskModal =
    document.querySelector('#taskModal');

const closeModalButton =
    document.querySelector('#closeModal');

const taskForm =
    document.querySelector('#taskForm');

const taskList =
    document.querySelector('#taskList');

const taskTitle =
    document.querySelector('#taskTitle');

const taskDescription =
    document.querySelector('#taskDescription');

const taskCategory =
    document.querySelector('#taskCategory');

const taskDueDate =
    document.querySelector('#taskDueDate');

const totalTasks =
    document.querySelector('#totalTasks');

const completedTasks =
    document.querySelector('#completedTasks');

const pendingTasks =
    document.querySelector('#pendingTasks');

const taskDetails =
    document.querySelector('#taskDetails');


// =========================
// Sidebar
// =========================

const dashboardNav =
    document.querySelector('#dashboardNav');

const allTasksNav =
    document.querySelector('#allTasksNav');

const completedNav =
    document.querySelector('#completedNav');

const categoriesNav =
    document.querySelector('#categoriesNav');


// =========================
// Load User's Tasks
// =========================

function loadTasks() {

    const savedTasks = JSON.parse(
        localStorage.getItem('taskflowTasks')
    ) || {};


    tasks = savedTasks[currentUser.email] || [];


    // Convert saved dates back into Date objects

    tasks.forEach(function (task) {

        task.createdAt = new Date(task.createdAt);

    });

}


// =========================
// Save User's Tasks
// =========================

function saveTasks() {

    const savedTasks = JSON.parse(
        localStorage.getItem('taskflowTasks')
    ) || {};


    savedTasks[currentUser.email] = tasks;


    localStorage.setItem(
        'taskflowTasks',
        JSON.stringify(savedTasks)
    );

}


// =========================
// Open Add Task Modal
// =========================

addTaskButton.addEventListener(
    'click',
    function () {

        taskForm.reset();

        delete taskForm.dataset.editingId;

        taskModal.style.display = 'flex';

        taskTitle.focus();

    }
);


// =========================
// Close Modal
// =========================

closeModalButton.addEventListener(
    'click',
    function () {

        taskModal.style.display = 'none';

        taskForm.reset();

        delete taskForm.dataset.editingId;

    }
);


// =========================
// Close Modal Outside
// =========================

taskModal.addEventListener(
    'click',
    function (event) {

        if (event.target === taskModal) {

            taskModal.style.display = 'none';

            taskForm.reset();

            delete taskForm.dataset.editingId;

        }

    }
);


// =========================
// Sidebar Navigation
// =========================

dashboardNav.addEventListener(
    'click',
    function (event) {

        event.preventDefault();

        currentView = 'dashboard';

        updateActiveNav(dashboardNav);

        renderTasks();

    }
);


allTasksNav.addEventListener(
    'click',
    function (event) {

        event.preventDefault();

        currentView = 'all';

        updateActiveNav(allTasksNav);

        renderTasks();

    }
);


completedNav.addEventListener(
    'click',
    function (event) {

        event.preventDefault();

        currentView = 'completed';

        updateActiveNav(completedNav);

        renderTasks();

    }
);


categoriesNav.addEventListener(
    'click',
    function (event) {

        event.preventDefault();

        currentView = 'categories';

        updateActiveNav(categoriesNav);

        renderTasks();

    }
);


// =========================
// Update Active Navigation
// =========================

function updateActiveNav(activeNav) {

    dashboardNav.classList.remove('active');

    allTasksNav.classList.remove('active');

    completedNav.classList.remove('active');

    categoriesNav.classList.remove('active');

    activeNav.classList.add('active');

}


// =========================
// Task Form
// =========================

taskForm.addEventListener(
    'submit',
    function (event) {

        event.preventDefault();


        const title =
            taskTitle.value.trim();

        const description =
            taskDescription.value.trim();

        const category =
            taskCategory.value;

        const dueDate =
            taskDueDate.value;


        if (title === '') {

            taskTitle.focus();

            return;

        }


        // =========================
        // Edit Existing Task
        // =========================

        if (taskForm.dataset.editingId) {

            const taskId = Number(
                taskForm.dataset.editingId
            );


            const task = tasks.find(
                function (task) {

                    return task.id === taskId;

                }
            );


            if (!task) {

                return;

            }


            task.title = title;

            task.description = description;

            task.category = category;

            task.dueDate = dueDate;


            selectedTaskId = taskId;


            delete taskForm.dataset.editingId;


            taskForm.reset();

            taskModal.style.display = 'none';


            saveTasks();

            renderTasks();

            updateTaskSummary();

            showTaskDetails(task);


            return;

        }


        // =========================
        // Create New Task
        // =========================

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            completed: false,

            category: category,

            createdAt: new Date(),

            dueDate: dueDate

        };


        tasks.unshift(newTask);


        selectedTaskId = newTask.id;


        taskForm.reset();

        taskModal.style.display = 'none';


        saveTasks();

        renderTasks();

        updateTaskSummary();

        showTaskDetails(newTask);

    }
);


// =========================
// Render Tasks
// =========================

function renderTasks() {

    let tasksToDisplay = [];


    // Dashboard

    if (currentView === 'dashboard') {

        tasksToDisplay = [...tasks];

    }


    // All Tasks

    else if (currentView === 'all') {

        tasksToDisplay = [...tasks];

    }


    // Completed

    else if (currentView === 'completed') {

        tasksToDisplay = tasks.filter(
            function (task) {

                return task.completed === true;

            }
        );

    }


    // Categories

    else if (currentView === 'categories') {

        renderCategories();

        return;

    }


    if (tasksToDisplay.length === 0) {

        showEmptyTaskList();

        return;

    }


    // Pending first

    const incompleteTasks =
        tasksToDisplay.filter(
            function (task) {

                return task.completed === false;

            }
        );


    // Completed second

    const completedTaskList =
        tasksToDisplay.filter(
            function (task) {

                return task.completed === true;

            }
        );


    const sortedTasks = [

        ...incompleteTasks,

        ...completedTaskList

    ];


    taskList.innerHTML =
        sortedTasks.map(
            function (task) {

                return createTaskCard(task);

            }
        ).join('');


    // Restore selected task

    if (selectedTaskId !== null) {

        const selectedCard =
            document.querySelector(
                `.task-card[data-task-id="${selectedTaskId}"]`
            );


        if (selectedCard) {

            selectedCard.classList.add(
                'selected'
            );

        }

    }

}


// =========================
// Create Task Card
// =========================

function createTaskCard(task) {

    const taskClass =
        task.completed
            ? 'completed'
            : 'pending';


    const checked =
        task.completed
            ? 'checked'
            : '';


    const categoryText =
        task.category
            ? task.category
            : 'No category';


    const dueDateText =
        task.dueDate
            ? formatDate(task.dueDate)
            : 'No due date';


    return `

        <article
            class="task-card ${taskClass}"
            data-task-id="${task.id}"
        >

            <div class="task-card-main">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-task-id="${task.id}"
                    ${checked}
                >


                <div class="task-card-content">

                    <h3>
                        ${escapeHTML(task.title)}
                    </h3>


                    <p>
                        ${escapeHTML(
                            task.description ||
                            'No description'
                        )}
                    </p>


                    <div class="task-meta">

                        <span>
                            📁
                            ${escapeHTML(categoryText)}
                        </span>


                        <span>
                            📅
                            ${dueDateText}
                        </span>

                    </div>

                </div>

            </div>


            <div class="task-status">

                ${
                    task.completed
                        ? '✓ Completed'
                        : '● Pending'
                }

            </div>

        </article>

    `;

}


// =========================
// Task List Click
// =========================

taskList.addEventListener(
    'click',
    function (event) {

        const checkbox =
            event.target.closest(
                '.task-checkbox'
            );


        if (checkbox) {

            const taskId =
                Number(
                    checkbox.dataset.taskId
                );


            toggleTask(taskId);

            return;

        }


        const taskCard =
            event.target.closest(
                '.task-card'
            );


        if (!taskCard) {

            return;

        }


        const taskId =
            Number(
                taskCard.dataset.taskId
            );


        selectTask(taskId);

    }
);


// =========================
// Select Task
// =========================

function selectTask(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    selectedTaskId = taskId;


    document
        .querySelectorAll('.task-card')
        .forEach(
            function (card) {

                card.classList.remove(
                    'selected'
                );

            }
        );


    const selectedCard =
        document.querySelector(
            `.task-card[data-task-id="${taskId}"]`
        );


    if (selectedCard) {

        selectedCard.classList.add(
            'selected'
        );

    }


    showTaskDetails(task);

}


// =========================
// Show Task Details
// =========================

function showTaskDetails(task) {

    const statusText =
        task.completed
            ? 'Completed'
            : 'Pending';


    const categoryText =
        task.category
            ? task.category
            : 'No category';


    const dueDateText =
        task.dueDate
            ? formatDate(task.dueDate)
            : 'No due date';


    taskDetails.innerHTML = `

        <div class="task-details-content">

            <div class="details-header">

                <span class="details-label">
                    TASK DETAILS
                </span>


                <span class="details-status ${
                    task.completed
                        ? 'completed-status'
                        : 'pending-status'
                }">

                    ${statusText}

                </span>

            </div>


            <h2>
                ${escapeHTML(task.title)}
            </h2>


            <div class="detail-group">

                <span class="detail-title">
                    Description
                </span>


                <p>
                    ${
                        escapeHTML(
                            task.description ||
                            'No description provided.'
                        )
                    }
                </p>

            </div>


            <div class="detail-group">

                <span class="detail-title">
                    Category
                </span>


                <p>
                    ${escapeHTML(categoryText)}
                </p>

            </div>


            <div class="detail-group">

                <span class="detail-title">
                    Created
                </span>


                <p>
                    ${formatDateTime(
                        task.createdAt
                    )}
                </p>

            </div>


            <div class="detail-group">

                <span class="detail-title">
                    Due date
                </span>


                <p>
                    ${dueDateText}
                </p>

            </div>


            <div class="details-actions">

                <button
                    type="button"
                    class="edit-task-btn"
                    data-task-id="${task.id}"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="delete-task-btn"
                    data-task-id="${task.id}"
                >
                    Delete
                </button>

            </div>

        </div>

    `;

}


// =========================
// Task Details Actions
// =========================

taskDetails.addEventListener(
    'click',
    function (event) {

        const editButton =
            event.target.closest(
                '.edit-task-btn'
            );


        const deleteButton =
            event.target.closest(
                '.delete-task-btn'
            );


        if (editButton) {

            const taskId =
                Number(
                    editButton.dataset.taskId
                );


            editTask(taskId);

            return;

        }


        if (deleteButton) {

            const taskId =
                Number(
                    deleteButton.dataset.taskId
                );


            deleteTask(taskId);

        }

    }
);


// =========================
// Toggle Task
// =========================

function toggleTask(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    task.completed =
        !task.completed;


    selectedTaskId =
        taskId;


    saveTasks();

    renderTasks();

    updateTaskSummary();

    showTaskDetails(task);

}


// =========================
// Edit Task
// =========================

function editTask(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    taskTitle.value =
        task.title;

    taskDescription.value =
        task.description;

    taskCategory.value =
        task.category;

    taskDueDate.value =
        task.dueDate;


    taskForm.dataset.editingId =
        taskId;


    taskModal.style.display =
        'flex';


    taskTitle.focus();

}


// =========================
// Delete Task
// =========================

function deleteTask(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            function (task) {

                return task.id !== taskId;

            }
        );


    selectedTaskId =
        null;


    saveTasks();

    renderTasks();

    updateTaskSummary();

    showEmptyDetails();

}


// =========================
// Categories
// =========================

function renderCategories() {

    if (tasks.length === 0) {

        taskList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    +
                </div>

                <h3>
                    No categories yet
                </h3>

                <p>
                    Create tasks with categories
                    to see them here.
                </p>

            </div>

        `;

        return;

    }


    const categories = [];


    tasks.forEach(
        function (task) {

            if (
                task.category &&
                !categories.includes(
                    task.category
                )
            ) {

                categories.push(
                    task.category
                );

            }

        }
    );


    if (categories.length === 0) {

        taskList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    +
                </div>

                <h3>
                    No categories yet
                </h3>

                <p>
                    Assign a category to your
                    tasks to see categories here.
                </p>

            </div>

        `;

        return;

    }


    taskList.innerHTML = `

        <div class="category-list">

            ${
                categories.map(
                    function (category) {

                        const categoryTasks =
                            tasks.filter(
                                function (task) {

                                    return (
                                        task.category ===
                                        category
                                    );

                                }
                            );


                        return `

                            <button
                                type="button"
                                class="category-card"
                                data-category="${escapeHTML(category)}"
                            >

                                <span
                                    class="category-name"
                                >
                                    ${escapeHTML(
                                        formatCategoryName(
                                            category
                                        )
                                    )}
                                </span>


                                <span
                                    class="category-count"
                                >
                                    ${categoryTasks.length}

                                    ${
                                        categoryTasks.length === 1
                                            ? 'task'
                                            : 'tasks'
                                    }

                                </span>

                            </button>

                        `;

                    }
                ).join('')
            }

        </div>

    `;

}


// =========================
// Category Click
// =========================

taskList.addEventListener(
    'click',
    function (event) {

        const categoryCard =
            event.target.closest(
                '.category-card'
            );


        if (!categoryCard) {

            return;

        }


        const category =
            categoryCard.dataset.category;


        showCategoryTasks(category);

    }
);


// =========================
// Show Category Tasks
// =========================

function showCategoryTasks(category) {

    const categoryTasks =
        tasks.filter(
            function (task) {

                return (
                    task.category ===
                    category
                );

            }
        );


    const incompleteTasks =
        categoryTasks.filter(
            function (task) {

                return task.completed === false;

            }
        );


    const completedTaskList =
        categoryTasks.filter(
            function (task) {

                return task.completed === true;

            }
        );


    const sortedTasks = [

        ...incompleteTasks,

        ...completedTaskList

    ];


    taskList.innerHTML = `

        <div class="section-header">

            <h3>
                ${escapeHTML(
                    formatCategoryName(category)
                )}
            </h3>

        </div>


        ${
            sortedTasks.length > 0

                ? sortedTasks.map(
                    function (task) {

                        return createTaskCard(task);

                    }
                ).join('')

                : `

                    <div class="empty-state">

                        <h3>
                            No tasks in this category
                        </h3>

                    </div>

                `
        }

    `;


    if (selectedTaskId !== null) {

        const selectedCard =
            document.querySelector(
                `.task-card[data-task-id="${selectedTaskId}"]`
            );


        if (selectedCard) {

            selectedCard.classList.add(
                'selected'
            );

        }

    }

}


// =========================
// Empty Task List
// =========================

function showEmptyTaskList() {

    let title =
        'No tasks yet';


    let message =
        'Create your first task and start organizing your work.';


    if (currentView === 'completed') {

        title =
            'No completed tasks';


        message =
            'Tasks you complete will appear here.';

    }


    taskList.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                +
            </div>


            <h3>
                ${title}
            </h3>


            <p>
                ${message}
            </p>

        </div>

    `;

}


// =========================
// Task Summary
// =========================

function updateTaskSummary() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed === true;

            }
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

}


// =========================
// Format Date
// =========================

function formatDate(dateString) {

    if (!dateString) {

        return 'No due date';

    }


    const date =
        new Date(
            dateString + 'T00:00:00'
        );


    return date.toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }
    );

}


// =========================
// Format Date & Time
// =========================

function formatDateTime(date) {

    const taskDate =
        new Date(date);


    return taskDate.toLocaleString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }
    );

}


// =========================
// Format Category
// =========================

function formatCategoryName(category) {

    if (!category) {

        return 'No category';

    }


    return (
        category.charAt(0).toUpperCase()
        + category.slice(1)
    );

}


// =========================
// Escape HTML
// =========================

function escapeHTML(value) {

    const div =
        document.createElement('div');


    div.textContent =
        value;


    return div.innerHTML;

}


// =========================
// Empty Details
// =========================

function showEmptyDetails() {

    taskDetails.innerHTML = `

        <div class="empty-details">

            <div class="details-icon">
                ✓
            </div>


            <h2>
                Select a task
            </h2>


            <p>
                Select a task from the list
                to view its details.
            </p>

        </div>

    `;

}


// =========================
// Start Dashboard
// =========================

loadTasks();

renderTasks();

updateTaskSummary();

showEmptyDetails();