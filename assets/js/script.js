const currentDate = dayjs().format('MM DD, YYYY');
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
// Retrieve tasks and nextId from localStorage
function readFromStorage() {
    let taskList = JSON.parse(localStorage.getItem('tasks'));
        if (!taskList) {
            taskList = [];
        }
        return taskList;
}

function saveToStorage(taskList) {
    localStorage.setItem('tasks'), JSON.stringify(taskList);
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(newTask) {
    const taskCard = $('<div>')
        .addClass('card draggable my-3')
        .attr('data-task-id', newTask.id);
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
        .attr('data-project-id', newTask.id);
    taskDelete.on('click', handleDeleteTask);
    


    //create cards for each task in array
    // for(let i = 0; i < taskList.length; i++) {
    //     const task = taskList[i];
    

 
    

    // taskHeader.text(task.title);
    // taskDelete.text('Delete');
    // taskDescription.text(task.description);
    // taskDueDate.text(task.dueDate);

    // taskHeader.addClass('card-header');
    // taskCard.addClass('card draggable my-3');
    // taskCard.attr('data-task-id', task.id);
    // taskBody.addClass('card-body');
    // taskDescription.addClass('card-text');
    // taskDueDate.addClass('card-text');
    // taskDelete.addClass('btn btn-danger delete');
    // taskDelete.attr('data-task-id', task.id);
    // taskDelete.on('click', handleDeleteTask);


    //add colors to cards based on due dates
    // const now = dayjs();
    // const taskDue = dayjs(task.dueDate, 'MM DD, YYYY');
    
    // if(now.isSame(taskDue, 'day')) {
    //     taskCard.addClass('bg-warning text-white');
    // } else if (now.isAfter(taskDue)) {
    //     taskCard.addClass('bg-danger text-white');
    //     taskDelete.addClass('border-light');
    // } else {
    //     taskCard.addClass('bg-light');
    // }

    //append card components to card body and append card to column
    // toDoColumn.append(taskCard);
    // taskCard.append(taskHeader, taskBody);
    // taskBody.append(taskDescription, taskDueDate, taskDelete);
    
    // }

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
    taskList.push(newTask);
    saveToStorage(taskList);
    renderTaskList();

    //  clear task input form after each use
    taskTitleInput.val('');
    dueDateInput.val('');
    taskDescriptionInput.val('');   
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = getTask();

    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    })
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskList = getTask();
//   let savedId = JSON.parse(localStorage.getItem('nextId'));

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    addTaskBtn.on('click', handleAddTask);
    laneContainer.on('click', '.btn .delete', handleDeleteTask);
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
        //  greedy: true,
        //  drop: handleDrop()
          });

    // $(".droppable").droppable("option", "greedy", true);
    $(".draggable").on("dropover", handleDrop)
   

});

