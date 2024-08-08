import $ from 'jquery';

import {
  indexTasks,
  postTask,
} from "./requests.js";

indexTasks(function (response) {
  var htmlString = response.tasks.map(function(task) {
    return "<div class='col-12 mb-3 p-2 border rounded task' data-id='" + task.id + "'> \
      " + task.content + "\
      </div>";
  });

  $("#tasks").html(htmlString);
});

document.addEventListener('DOMContentLoaded', () => {
  const newTaskForm = document.getElementById('new-task-form');
  const newTaskInput = document.getElementById('new-task');
  const tasksList = document.getElementById('tasks');
  const completedTasksList = document.getElementById('completed-tasks');
  const showActiveTasksBtn = document.getElementById('show-active-tasks');
  const showCompletedTasksBtn = document.getElementById('show-completed-tasks');

  newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = newTaskInput.value.trim();
    if (taskText) {
      addTask(taskText);
      newTaskInput.value = '';
    }
  });

  showActiveTasksBtn.addEventListener('click', () => {
    tasksList.classList.remove('d-none');
    completedTasksList.classList.add('d-none');
  });

  showCompletedTasksBtn.addEventListener('click', () => {
    completedTasksList.classList.remove('d-none');
    tasksList.classList.add('d-none');
  });

  function addTask(text) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';
    
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = text;
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success btn-sm';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => {
      taskItem.remove();
      completeTask(taskText.textContent);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();
    });
    
    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(deleteBtn);
    taskItem.appendChild(taskText);
    taskItem.appendChild(btnGroup);
    tasksList.appendChild(taskItem);
  }

  function completeTask(text) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';

    const taskText = document.createElement('span');
    taskText.className = 'task-text completed';
    taskText.textContent = text;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();
    });

    btnGroup.appendChild(deleteBtn);
    taskItem.appendChild(taskText);
    taskItem.appendChild(btnGroup);
    completedTasksList.appendChild(taskItem);
  }
});
