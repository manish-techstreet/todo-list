document.addEventListener("DOMContentLoaded", function () {
    // Get references to various HTML elements
    const taskList = document.getElementById("taskListItems");
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const dateElement = document.getElementById("date");
    const tasksCountElement = document.getElementById("tasks");
    const completeAllButton = document.getElementById("completeAll");
    const showAllButton = document.getElementById("showAll");
    const showCompletedButton = document.getElementById("showCompleted");
    const showUncompletedButton = document.getElementById("showUncompleted");

    // Initialize an empty tasks array and set the default filter to "all"
    const tasks = [];
    let filter = "all"; // Default filter

    // Add event listeners to buttons and input field
    addButton.addEventListener("click", newItem);
    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            newItem();
        }
    });

    completeAllButton.addEventListener("click", completeAllTasks);
    showAllButton.addEventListener("click", function () {
        filter = "all";
        applyFilter();
    });
    showCompletedButton.addEventListener("click", function () {
        filter = "completed";
        applyFilter();
    });
    showUncompletedButton.addEventListener("click", function () {
        filter = "uncompleted";
        applyFilter();
    });

    // Function to add a new task
    function newItem() {
        const taskName = taskInput.value.trim();
        if (taskName === "") return;

        tasks.push({ name: taskName, completed: false });
        taskInput.value = "";

        renderTasks();
    }

    // Function to delete a task by index
    function delItem(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Function to render tasks based on the filter
    function renderTasks() {
        taskList.innerHTML = "";

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if ((filter === "completed" && !task.completed) || (filter === "uncompleted" && task.completed)) {
                continue;
            }

            const listItem = document.createElement("li");
            listItem.className = "task-list-item";

            const label = document.createElement("label");
            label.className = "task-list-item-label";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                listItem.classList.toggle("completed", task.completed);
                checkbox.disabled = task.completed;

                updateTasksCount();
            });

            const span = document.createElement("span");
            span.textContent = task.name;

            const deleteBtn = document.createElement("span");
            deleteBtn.className = "delete-btn";
            deleteBtn.title = "Delete Task";
            deleteBtn.addEventListener("click", function () {
                delItem(i);
                updateTasksCount();
            });

            label.appendChild(checkbox);
            label.appendChild(span);
            listItem.appendChild(label);
            listItem.appendChild(deleteBtn);
            taskList.appendChild(listItem);
        }

        // Update the date
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);

        updateTasksCount();
    }

    // Function to mark all tasks as completed
    function completeAllTasks() {
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].completed = true;
        }
        renderTasks();
    }

    // Function to apply the selected filter and update button styles
    function applyFilter() {
        showAllButton.classList.remove("active");
        showCompletedButton.classList.remove("active");
        showUncompletedButton.classList.remove("active");

        if (filter === "all") {
            showAllButton.classList.add("active");
        } else if (filter === "completed") {
            showCompletedButton.classList.add("active");
        } else if (filter === "uncompleted") {
            showUncompletedButton.classList.add("active");
        }

        renderTasks();
    }

    // Function to update the count of tasks left
    function updateTasksCount() {
        const tasksLeft = tasks.filter(task => !task.completed).length;
        tasksCountElement.textContent = `${tasksLeft} task${tasksLeft !== 1 ? 's' : ''} left`;
    }

    // Initial rendering
    renderTasks();
});
