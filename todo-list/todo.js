console.log('Loading tasks from localStorage...');

// Get task strings from local storage
const pendingTasksString = localStorage.getItem('pendingTasks');
const completedTasksString = localStorage.getItem('completedTasks');

// Parse task strings into arrays
const pendingTasks = pendingTasksString?
    JSON.parse(pendingTasksString.split(',')) : [];
const completedTasks = completedTasksString?
    JSON.parse(completedTasksString.split(',')) : [];

// Set up priority to icon class mapping
const priorityToIconClass = new Map([
    [0, 'fa-solid fa-minus'],
    [1, 'fa-solid fa-equals'],
    [2, 'fa-solid fa-arrow-up'],
    [3, 'fa-solid fa-arrows-up-to-line'],
]);

// Set up initial task priority and name
let newPriority = 0;
let newTaskName = '';

// Set up drag and drop functionality
const setUpDnD = () => {
    // Get all list items
    const listItems = document.getElementsByTagName('li');

    // Loop through each list item and set up drag and drop events
    for(let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        // Carry dragged element id on drag start
        listItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        // Allow moving over other list items
        listItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        // Handle drop event
        listItem.addEventListener('drop', (e) => {
            e.preventDefault();
            // Get info about the dragged and target elements
            const id = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(id);
            const targetElement = e.target.closest('li');
            const targetElementBounds = targetElement.getBoundingClientRect();
            // Proceed if the dragged element and target element are different
            if(draggedElement && targetElement && draggedElement !== targetElement) {
                //Get element indeces
                let draggedTask = null;
                let draggedElementIndex = parseInt(draggedElement.id.split('-')[2]);
                let targetElementIndex = parseInt(targetElement.id.split('-')[2]);

                //Find the task corresponding to the dragged element and extract it
                if(draggedElement.id.startsWith('pending-task')) {
                    // Get the corresponding task
                    draggedTask = pendingTasks[parseInt(draggedElementIndex)];
                    // Remove the task from the pending tasks array
                    pendingTasks.splice(parseInt(draggedElementIndex), 1);
                    // Adjust the target element index if the dragged element is before the target element
                    if(targetElement.id.startsWith('pending-task') && targetElementIndex >= draggedElementIndex) {
                        targetElementIndex--;
                    }    
                }
                else {
                    // Get the corresponding task
                    draggedTask = completedTasks[parseInt(draggedElementIndex)];
                    // Remove the task from the completed tasks array
                    completedTasks.splice(parseInt(draggedElementIndex), 1);
                    // Adjust the target element index if the dragged element is before the target element
                    if(targetElement.id.startsWith('completed-task') && targetElementIndex >= draggedElementIndex) {
                        targetElementIndex--;
                    }
                }
                // Check if the dragged element is dropped after or before the target element
                if(e.clientY >= targetElementBounds.top + targetElementBounds.height / 2) {
                    if(targetElement.id.startsWith('pending-task')) {
                        // Insert the dragged task after the target element
                        pendingTasks.splice(targetElementIndex+1, 0, draggedTask);
                        // Adjust the priority of the new task based on the next/previous task's priority
                        if(pendingTasks[targetElementIndex+1].priority < (pendingTasks[targetElementIndex+2]?.priority || 0)){
                            pendingTasks[targetElementIndex+1].priority = pendingTasks[targetElementIndex+2].priority;
                        }
                        else if(pendingTasks[targetElementIndex+1].priority > (pendingTasks[targetElementIndex]?.priority || 3)){
                            pendingTasks[targetElementIndex+1].priority = pendingTasks[targetElementIndex].priority;
                        }
                    }
                    else {
                        // Insert the dragged task after the target element
                        completedTasks.splice(targetElementIndex+1, 0, draggedTask);
                        // Adjust the priority of the new task based on the next/previous task's priority
                        if(completedTasks[targetElementIndex+1].priority < (completedTasks[targetElementIndex+2]?.priority || 0)){
                            completedTasks[targetElementIndex+1].priority = completedTasks[targetElementIndex+2].priority;
                        }
                        else if(completedTasks[targetElementIndex+1].priority > (completedTasks[targetElementIndex]?.priority || 3)){
                            completedTasks[targetElementIndex+1].priority = completedTasks[targetElementIndex].priority;
                        }
                    }
                }
                else {
                    if(targetElement.id.startsWith('pending-task')) {
                        // Insert the dragged task before the target element
                        pendingTasks.splice(targetElementIndex, 0, draggedTask);
                        // Adjust the priority of the new task based on the next/previous task's priority
                        if(pendingTasks[targetElementIndex].priority < (pendingTasks[targetElementIndex+1]?.priority || 0)){
                            pendingTasks[targetElementIndex].priority = pendingTasks[targetElementIndex+1].priority;
                        }
                        else if(pendingTasks[targetElementIndex].priority > (pendingTasks[targetElementIndex-1]?.priority || 3)){
                            pendingTasks[targetElementIndex].priority = pendingTasks[targetElementIndex-1].priority;
                        }
                    }
                    else {
                        // Insert the dragged task before the target element
                        completedTasks.splice(targetElementIndex, 0, draggedTask);
                        // Adjust the priority of the new task based on the next/previous task's priority
                        if(completedTasks[targetElementIndex].priority < (completedTasks[targetElementIndex+1]?.priority || 0)){
                            completedTasks[targetElementIndex].priority = completedTasks[targetElementIndex+1].priority;
                        }
                        else if(completedTasks[targetElementIndex].priority > (completedTasks[targetElementIndex-1]?.priority || 3)){
                            completedTasks[targetElementIndex].priority = completedTasks[targetElementIndex-1].priority;
                        }
                    }
                }
                
                // Update the local storage with the new task arrays
                localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
                // Reload the task list to reflect the changes
                loadList();
                console.log('Moved task:', draggedElement.id, 
                    e.clientY >= targetElementBounds.top + targetElementBounds.height / 2?'after':'before',
                    targetElement.id);
            }
        });
    }
}

// Function to mark a task as complete
const markComplete = (index) => {
    console.log('Marking task as complete:', index);
    // Insert the task in the completed tasks array
    completedTasks.push(pendingTasks[index]);
    // Remove the task from the pending tasks array
    pendingTasks.splice(index, 1);
    // Update the local storage with the new task arrays
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Function to return a task to the pending tasks list
const returnToPending = (index) => {
    console.log('Returning task to pending:', index);
    // Insert the task in the pending tasks array
    pendingTasks.push(completedTasks[index]);
    // Remove the task from the completed tasks array
    completedTasks.splice(index, 1);
    // Update the local storage with the new task arrays
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Function to add a new task
const addTask = (name, priority) => {
    console.log('Adding task:', name, priority);
    const task = {
        name: name,
        priority: priority
    };
    pendingTasks.push(task);
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
}

// Function to search for tasks with a term and an option to scroll to the first search result (true/false)
const searchTasks = (searchTerm, scroll) => {
    // Get all task elements
    const tasks = document.querySelectorAll('.task');
    let scrolled = scroll;
    tasks.forEach(task => {
        // Get the label element within the task
        const label = task.querySelector('label');
        if(!label)
            return; 
        if(searchTerm === '') {
            task.style.backgroundColor = 'lightcyan';
            return;
        }
        // Check if the label text includes the search term
        if(label.innerHTML.toLowerCase().includes(searchTerm.toLowerCase())) {
            // Highlight the task
            task.style.backgroundColor = 'yellow';
            // Scroll to the first task if it matches the search term
            if(scrolled){
                task.scrollIntoView({ behavior: 'smooth', block: 'center' });
                scrolled = false;
            }
        }
        else {
            // Remove the highlight if it doesn't match
            task.style.backgroundColor = 'lightcyan';
        }
    });
}

// Function to load the task list
const loadList = () => {
    // Sort the tasks by priority
    pendingTasks.sort((a, b) => b.priority - a.priority);
    completedTasks.sort((a, b) => b.priority - a.priority);

    // Initialize the HTML for the create task form and the task lists
    let pendingTasksHTML = `
        <div id="create-task" class="task create-task">
            <form id="create-task-form">
                <input class="create-task" type="text" id="new-task" value="${newTaskName}" placeholder="Enter new task" required>
                <button class="create-task" type="button" id="change-priority">
                    <i class="${priorityToIconClass.get(newPriority)} p-0"></i>
                </button>
                <input class="create-task" type="submit" id="add-task" value="+">
            </form>
        </div>`;
    // Initialize the HTML for the completed tasks
    let completedTasksHTML = ``;

    // Loop through the pending tasks and create HTML for each task
    for(let i = 0; i < pendingTasks.length; i++) {
        const task = pendingTasks[i];
        pendingTasksHTML += `
            <li id="pending-task-${i}" draggable="true">
                <div class="task">
                    <label for="pending-task-${i} name=${task.name}">${task.name}</label>
                    <div class="d-inline-flex flex-row align-items-center">
                        <i class="${priorityToIconClass.get(task.priority)}"></i>
                        <button class="btn btn-outline-primary" type="button" id="pending-task-${i}">Mark Complete</button>
                    </div>
                </div>
            </li>
        `;
    }

    // Loop through the completed tasks and create HTML for each task
    for(let i = 0; i < completedTasks.length; i++) {
        const task = completedTasks[i];
        completedTasksHTML += `
            <li id="completed-task-${i}" draggable="true">
                <div class="task">
                    <label for="completed-task-${i}">${task.name}</label>
                    <div class="d-inline-flex flex-row align-items-center">
                        <i class="${priorityToIconClass.get(task.priority)}"></i>
                        <button class="btn btn-outline-primary" id="completed-task-${i}">Return To Pending</button>
                    </div>
                </div>
            </li>
        `;
    }

    // Set the inner HTML of the task lists
    document.getElementById('pending-tasks').innerHTML = pendingTasksHTML;
    document.getElementById('completed-tasks').innerHTML = completedTasksHTML;

    // Setup the click events for the mark complete buttons
    for(let i = 0; i < pendingTasks.length; i++) {
        document.getElementById(`pending-task-${i}`).addEventListener('click', () => {
            markComplete(i);
            loadList();
            searchTasks(document.getElementById("search").value, false);
        });
    }

    // Setup the click events for the return to pending buttons
    for(let i = 0; i < completedTasks.length; i++) {
        document.getElementById(`completed-task-${i}`).addEventListener('click', () => {
            returnToPending(i);
            loadList();
            searchTasks(document.getElementById("search").value, false);
        });
    }

    // Setup the click event for the add task button
    document.getElementById('create-task-form').addEventListener('submit', () => {
        const taskTextbox = document.getElementById('new-task');
        // Prevent adding empty tasks
        if (taskTextbox.value === '') {
            taskTextbox.style.border = '1px dotted red';
            setTimeout(() => taskTextbox.style.border = '1px dotted lightcyan', 350);
            return;
        }
        addTask(taskTextbox.value, newPriority);
        loadList();
    });
    
    // Setup the click event for the change priority button
    document.getElementById('change-priority').addEventListener('click', () => {
        newPriority = (newPriority + 1) % 4;
        loadList();
    });

    // Setup the add task textbox input event
    document.getElementById('new-task').addEventListener('input', (e) => {
        newTaskName = e.target.value;
    });

    setUpDnD();
    
}

loadList();


