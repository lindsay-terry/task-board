const taskTitleInput = $('#task-title');
const dueDateInput = $('#task-due-date');
const taskDescriptionInput = $('#task-description');
const addTaskBtn = $('#taskbtn');
const toDoColumn = $('#todo-cards').parent();
const inProgressColumn = $('#in-progress-cards').parent();
const doneColumn = $('#done-cards').parent();
const laneContainer = $('#lane-container');

let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

//Local storage functions for taskList array and nextId array
function readFromStorage() {
    let taskList = JSON.parse(localStorage.getItem('tasks'));
        if (!taskList) {
            taskList = [];
        }
        return taskList;
}

function saveToStorage(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

function readIdFromStorage() {
    let nextId= JSON.parse(localStorage.getItem('nextId'));
    if (!nextId) {
        nextId = [];
    }
    return nextId;   
}

function saveIdToStorage(nextId) {
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

//Generates a unique task ID
function generateTaskId() {
    return crypto.randomUUID();
}

// Creates html and styling for task cards
function createTaskCard(newTask) {
    const taskList = readFromStorage();
    const nextId = readIdFromStorage();
    
    
    const taskCard = $('<div>')
        .addClass('card draggable my-3')
        .data('data-task-id', newTask.id);
    const taskHeader = $('<h5>')
        .addClass('card-header').text(newTask.title);
    const taskBody = $('<div>')
        .addClass('card-body');
    const taskDescription = $('<p>')
        .addClass('card-text').text(newTask.description);
    const taskDueDate =$('<p>')
        .addClass('card-text').text(newTask.dueDate);
    const taskDelete = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .data('data-task-id', newTask.id);
    taskDelete.on('click', handleDeleteTask);
    
    if (newTask.dueDate && newTask.status !== 'done') {
        const dueDate = dayjs(newTask.dueDate, 'MM DD, YYYY');
        const currentDate = dayjs();
        //adjusts color of card by due date
        if (currentDate.isSame(dueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (currentDate.isAfter(dueDate)) {
            taskCard.addClass('bg-danger text-white');
            taskDelete.addClass('border-light');
        }
    }

    //appends all elements to taskCard and returns completed card
    taskCard.append(taskHeader, taskBody);
    taskBody.append(taskDescription, taskDueDate, taskDelete);
    return taskCard;
    
}

// Renders cards for each task created and makes draggable.
//Appends to proper column based on task status
function renderTaskList() {
    //empty columns to avoid duplicates being rendered
    toDoColumn.empty();
    inProgressColumn.empty();
    doneColumn.empty();
    const taskList = readFromStorage();

    for (let task of taskList) {
        if (task.status === 'to-do') {
            toDoColumn.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressColumn.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneColumn.append(createTaskCard(task));
        }
    }

    //make cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
      });

}

//Uses user input information to create a task object and pushes data to arrays
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = taskTitleInput.val().trim();
    const dueDate = dueDateInput.val();
    const taskDescription = taskDescriptionInput.val().trim();

    const taskList = readFromStorage();
    const nextId = readIdFromStorage();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        dueDate: dueDate,
        description: taskDescription,
        status: 'to-do',
    }

    
    nextId.push({ id: newTask.id });
    saveIdToStorage(nextId);
    

    taskList.push(newTask);
    saveToStorage(taskList);
    
    
    renderTaskList();
    
    
    //  clear task input form after each use
    taskTitleInput.val('');
    dueDateInput.val('');
    taskDescriptionInput.val('');   
}

// Handles deleteing tasks
function handleDeleteTask(event){
    const taskList = readFromStorage();
    const nextId = readIdFromStorage();
    const btnClicked = $(event.target);

    //retrieve the ID from data attribute assigned to button
    const taskId = btnClicked.data('data-task-id');
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    const taskIdIndex = nextId.findIndex(id => id === taskId);


    //removes from taskList array
    if (taskIndex > -1) {
        taskList.splice(taskIndex, 1);
    }
    //removes from nextId array
    if (taskIdIndex) {
        nextId.splice(taskIdIndex, 1);
    }

    //removes rendered card
    btnClicked.parent().parent('div').remove();
    saveToStorage(taskList);
    saveIdToStorage(nextId);
    console.log(taskList, nextId);
}

//Allows tasks to be dropped into different columns
function handleDrop(event, ui) {
    const taskList = readFromStorage();

    //Finds card id by accessing data attribute of dragged card
    const cardId = ui.draggable.data('data-task-id');
    
    for (i = 0; i < taskList.length; i++) {
        const task = taskList[i];
        const newStatus = event.target.id;
        
        //compares card Id and task Id and replaces status in actual object
        if (cardId === task.id) {
            task.status = newStatus;

        }
       
}   
saveToStorage(taskList);
renderTaskList();

}

// On window load:
$(document).ready(function () {
    //reads local storage
    const taskList = readFromStorage();
    //renders task list
    renderTaskList();
    //event listener to add tasks
    addTaskBtn.on('click', handleAddTask);
    //event listener for deleting tasks
    laneContainer.on('click', '.btn-danger', handleDeleteTask);
    
    // datepicker
    $(function() {
        $( "#task-due-date" ).datepicker({
          changeMonth: true,
          changeYear: true
        });
      } );

    //make lanes droppable
    $( ".droppable" ).droppable({
        accept: '.draggable',
         drop: handleDrop, 
          });
   
});

