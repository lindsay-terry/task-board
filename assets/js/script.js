const currentDate = dayjs().format('MM DD, YYYY');
const taskTitleInput = $('#task-title');
const dueDateInput = $('#task-due-date');
const taskDescriptionInput = $('#task-description');
const addTaskBtn = $('#taskbtn');
const toDoColumn = $('#todo-cards');


// Retrieve tasks and nextId from localStorage
// let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskList = JSON.parse(localStorage.getItem("tasks"));
    if (!taskList) {
        taskList = [];
    }

function storeTask(newTask) {
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

function getTask(){
    return taskList;
}



// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(newTask) {
    getTask();

    for(let i = 0; i < taskList.length; i++) {
        const task = taskList[i];
    

    const taskCard = $('<div>');
    const taskHeader = $('<h5>');
    const taskBody = $('<div>');
    const taskDescription = $('<p>');
    const taskDueDate =$('<p>');
    const taskDelete = $('<button>');

    taskHeader.text(task.title);
    taskDelete.text('Delete');
    taskDescription.text(task.description);
    taskDueDate.text(task.dueDate);

    taskHeader.addClass('task-card-title');
    taskCard.addClass('task-card sortable');
    taskBody.addClass('task-card-body');
    taskDescription.addClass('task-card-text');
    taskDueDate.addClass('task-card-text');
    taskDelete.addClass('btn btn-danger delete');



    toDoColumn.append(taskCard);
    taskCard.append(taskHeader, taskBody);
    taskBody.append(taskDescription, taskDueDate, taskDelete);
    
    }

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let task = getTask();
    createTaskCard(task);




    $( function() {
        $( ".sortable" ).sortable({
          connectWith: ".connectedSortable"
        }).disableSelection();
      } );

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let taskID = generateTaskId()
        const titleValue = taskTitleInput.val();
        const dueDateValue = dayjs(dueDateInput.val()).format('MM DD, YYYY');
        const descriptionValue = descriptionInput.val();

    let newTask = {
        title: titleValue,
        dueDate: dueDateValue,
        description: descriptionValue,
        id: taskID,
    }
    
    localStorage.setItem("nextId", JSON.stringify(task.id));
    storeTask(newTask);
    
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    addTaskBtn.on('click', handleAddTask);
    renderTaskList();
    // datepicker
    $(function() {
        $( "#task-due-date" ).datepicker({
          changeMonth: true,
          changeYear: true
        });
      } );

   

});

