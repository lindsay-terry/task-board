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
    localStorage.setItem('tasks', JSON.stringify(taskList));
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(newTask) {
    const taskList = readFromStorage();

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
        .data('data-project-id', newTask.id);
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
    // saveToStorage(taskList);


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
    
    // taskList.forEach(newTask => {
    //     toDoColumn.append(createTaskCard(newTask));
    // })

   

    // $('.draggable').draggable({
    //     opacity: 0.7,
    //     zIndex: 100,
    //     helper: function (e) {
    //       const original = $(e.target).hasClass('ui-draggable')
    //         ? $(e.target)
    //         : $(e.target).closest('.ui-draggable');
    //       return original.clone().css({
    //         width: original.outerWidth(),
    //       });
    //     },
    //   });

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
    const taskExists = taskList.some(task => task.id === newTask.id);
    if (!taskExists) {
        taskList.push(newTask);
        
    }
    
    saveToStorage(taskList);
    renderTaskList();
    

    //  clear task input form after each use
    taskTitleInput.val('');
    dueDateInput.val('');
    taskDescriptionInput.val('');   
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskList = readFromStorage();
    event.preventDefault();
    
    const taskToDelete = event.target.id;
    const indexToDelete = taskList.findIndex( task => task.id === taskToDelete);
    if (indexToDelete !== -1) {
        taskList.splice(indexToDelete, 1);
    }

    saveToStorage(taskList);
    // const taskId = $(this).attr('data-task-id');
    // const tasks = getTask();

    // tasks.forEach((task) => {
    //     if (task.id === taskId) {
    //         tasks.splice(tasks.indexOf(task), 1);
    //     }
    // })
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
//   let taskList = getTask();
//   let savedId = JSON.parse(localStorage.getItem('nextId'));

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    const taskList = readFromStorage();
    renderTaskList();
    addTaskBtn.on('click', handleAddTask);
    laneContainer.on('click', '.btn .delete', handleDeleteTask);
    
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

