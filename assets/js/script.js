const taskTitleInput = $('#task-title');
const dueDateInput = $('#task-due-date');
const taskDescriptionInput = $('#task-description');
const addTaskBtn = $('#taskbtn');
const toDoColumn = $('#todo-cards');
const inProgressColumn = $('#in-progress-cards');
const doneColumn = $('#done-cards');
const laneContainer = $('#lane-container');

let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
// Retrieve tasks and UniqueId from localStorage
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
    let nextId = JSON.parse(localStorage.getItem('nextId'));
        if (!nextId) {
            nextId = [];
        }
        return nextId;
}

function saveIdToStorage() {
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
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

        if (currentDate.isSame(dueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (currentDate.isAfter(dueDate)) {
            taskCard.addClass('bg-danger text-white');
            taskDelete.addClass('border-light');
        }
    }


    taskCard.append(taskHeader, taskBody);
    taskBody.append(taskDescription, taskDueDate, taskDelete);
    return taskCard;
    
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //empty columns to avoid duplicates being rendered on handleAddTask
    toDoColumn.empty();
    inProgressColumn.empty();
    doneColumn.empty();
    const taskList = readFromStorage();

    for (let task of taskList) {
        if (task.status === 'to-do') {
            toDoColumn.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressColumn.append(createTaskCard(task));
        } else {
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

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = taskTitleInput.val().trim();
    const dueDate = dueDateInput.val();
    const taskDescription = taskDescriptionInput.val().trim();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        dueDate: dueDate,
        description: taskDescription,
        status: 'to-do',
    }

    const taskList = readFromStorage();
    const nextId = readIdFromStorage();
  
    taskList.push(newTask);
    nextId.push(newTask.id);
    
    saveToStorage(taskList);
    saveIdToStorage(nextId);
    renderTaskList();
    
    
    //  clear task input form after each use
    taskTitleInput.val('');
    dueDateInput.val('');
    taskDescriptionInput.val('');   
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskList = readFromStorage();
    const btnClicked = $(event.target);

    //retrieve the ID from data attribute assigned to button
    const taskId = btnClicked.data('data-task-id');
    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex > -1) {
        taskList.splice(taskIndex, 1);
    }

    btnClicked.parent().parent('div').remove();
    saveToStorage(taskList);
   
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskList = readFromStorage();

    const taskId = ui.draggable.data('data-task-id');
    const parentColumn = event.target.parentElement;
    console.log(taskId);

    for (task of taskList) {

        if (parentColumn === inProgressColumn.parentElement && taskId === task.id) {
            task.status = 'in-progress';
        } else if (parentColumn === doneColumn.parentElement && taskId === task.id) {
            task.status = 'done';
        }
    }
    console.log(task.status);
    saveToStorage(taskList);
    renderTaskList();
    
    // const draggableCard = $(event.target);
    // if (event.target)data('task-card-id') {
        
        // }
        
        // const droppedCard = draggableCard.data('task-card-id');


    // const droppedCardIndex = taskList.findIndex(task => task.id === droppedCard);
    //     if (droppedCardIndex > -1) {
    //         taskList[droppedCardIndex].status = 'In Progress';
    //     }

    
    


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    const taskList = readFromStorage();
    renderTaskList();
    addTaskBtn.on('click', handleAddTask);
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

    // $(".droppable").droppable("option", "greedy", true);
    // $(".draggable").on("dropover", handleDrop)
   

});

