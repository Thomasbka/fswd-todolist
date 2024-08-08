import $ from 'jquery';
import {
  indexTasks,
  postTask,
} from "./requests.js";

function completeTask(taskId, taskText, taskItem) {
  $.ajax({
    type: 'PUT',
    url: `/api/tasks/${taskId}/mark_complete?api_key=1`,
    success: function(response) {
      taskItem.remove();
      addCompletedTaskToList(response.task.content, taskId);
    },
    error: function(error) {
      console.error(`Failed to complete task ${taskId}:`, error);
    }
  });
}

function deleteTask(taskId, taskItem) {
  $.ajax({
    type: 'DELETE',
    url: `/api/tasks/${taskId}?api_key=1`,
    success: function() {
      taskItem.remove();
    },
    error: function(error) {
      console.error(`Failed to delete task ${taskId}:`, error);
    }
  });
}

function addCompletedTaskToList(text, id) {
  const taskItem = createTaskHTML({ id: id, content: text }, true);
  const completedTasksList = document.getElementById('completed-tasks');
  completedTasksList.appendChild(taskItem);
}

function createTaskHTML(task, completed = false) {
  const taskItem = document.createElement('li');
  taskItem.className = 'list-group-item';
  taskItem.dataset.id = task.id;

  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = task.content;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  if (!completed) {
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success btn-sm';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => {
      completeTask(task.id, taskText, taskItem);
    });
    btnGroup.appendChild(completeBtn);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger btn-sm';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id, taskItem);
  });

  btnGroup.appendChild(deleteBtn);
  taskItem.appendChild(taskText);
  taskItem.appendChild(btnGroup);

  return taskItem;
}

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
      postTask(taskText, function(response) {
        const taskItem = createTaskHTML(response.task);
        tasksList.appendChild(taskItem);
        newTaskInput.value = '';
      }, function (error) {
        console.error("Failed to create task:", error);
      });
    }
  });

  showActiveTasksBtn.addEventListener('click', () => {
    tasksList.classList.remove('d-none');
    completedTasksList.classList.add('d-none');
    showActiveTasksBtn.classList.add('active');
    showCompletedTasksBtn.classList.remove('active');
  });

  showCompletedTasksBtn.addEventListener('click', () => {
    completedTasksList.classList.remove('d-none');
    tasksList.classList.add('d-none');
    showCompletedTasksBtn.classList.add('active');
    showActiveTasksBtn.classList.remove('active');
  });

  indexTasks(function (response) {
    tasksList.innerHTML = ''; 
    completedTasksList.innerHTML = ''; 

    response.tasks.forEach(function(task) {
      const taskItem = createTaskHTML(task, task.completed);
      if (task.completed) {
        completedTasksList.appendChild(taskItem);
      } else {
        tasksList.appendChild(taskItem);
      }
    });
  }, function (error) {
    console.error("Failed to load tasks:", error);
  });

  showActiveTasksBtn.classList.add('active');
});

