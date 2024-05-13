const currentDate = dayjs().format('MM DD, YYYY');
const taskTitleInput = $('#task-title');
const dueDateInput = $('#task-due-date');
const taskDescriptionInput = $('#task-description');
const addTaskBtn = $('#taskbtn');
const toDoColumn = $('#to-do');


// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
if(!taskList) {
    taskList = [];
}

let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskId = crypto.randomUUID();
    localStorage.setItem('nextId', JSON.stringify(taskId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>');
    const taskHeader = $('<div>');
    const taskBody = $('<div>');
    const taskDescription = $('<p>');
    const taskDueDate =$('<p>');
    const taskDelete = $('<button>');

    taskBody.append(taskDescription, taskDueDate, taskDelete);
    taskCard.append(taskHeader, taskBody);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const titleValue = taskTitleInput.val().trim(); 
    const dueDateValue = dayjs(dueDateInput.val()).format('MM DD, YYYY');
    const descriptionValue = taskDescriptionInput.val().trim();

    let task = {
        title: titleValue,
        dueDate: dueDateValue,
        description: descriptionValue,
        id: generateTaskId(),
}       
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    //datepicker


});

$( function() {
    $( "#task-due-date" ).datepicker({
      changeMonth: true,
      changeYear: true
    });
  } );