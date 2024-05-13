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

    taskHeader.addClass('card-header');
    taskCard.addClass('card draggable');
    taskCard.attr('data-task-id', task.id);
    taskBody.addClass('card-body');
    taskDescription.addClass('card-text');
    taskDueDate.addClass('card-text');
    taskDelete.addClass('btn btn-danger delete');
    taskDelete.attr('data-task-id', task.id);

    const now = dayjs();
    const taskDue = dayjs(task.dueDate, 'MM DD, YYYY');
    
    if(now.isSame(taskDue, 'day')) {
        taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDue)) {
        taskCard.addClass('bg-danger text-white');
        taskDelete.addClass('border-light');
    } else {
        taskCard.addClass('bg-light');
    }

    // if (task.dueDate === currentDate) {
    //    taskCard.addClass('bg-warning text-white')
    // } else if (dayjs(currentDate).isAfter(dayjs(task.dueDate))) {
    //     taskCard.addClass('bg-danter text-white');
    //     taskDelete.addClass('border-light');
    // } else {
    //     taskCard.addClass('bg-light');
    // }

    toDoColumn.append(taskCard);
    taskCard.append(taskHeader, taskBody);
    taskBody.append(taskDescription, taskDueDate, taskDelete);
    
    }

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let newTask = getTask();
    createTaskCard(newTask);

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
    let taskID = generateTaskId()
        const titleValue = taskTitleInput.val();
        const dueDateValue = dayjs(dueDateInput.val()).format('MM DD, YYYY');
        const descriptionValue = taskDescriptionInput.val();

    let newTask = {
        title: titleValue,
        dueDate: dueDateValue,
        description: descriptionValue,
        id: taskID,
    }
    
    // localStorage.setItem("nextId", JSON.stringify(task.id));
    storeTask(newTask);

    //clear task input form after each use
    taskTitleInput.val('');
    dueDateInput.val('');
    taskDescriptionInput.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    taskList = getTask();
    const taskId = ui.draggable[0].dataset.taskId;
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

    //make lanes droppable
    $( ".droppable" ).droppable({
         accept: '.draggable',
        //  drop: handleDrop(),
          
          });
   

});

