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
}, function (error) {
  console.error("Failed to load tasks:", error);
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
      postTask(taskText, function(response) {
        addTaskToList(response.task);
        newTaskInput.value = '';
      }, function (error) {
        console.error("Failed to create task:", error);
      });
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

  function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';
    taskItem.dataset.id = task.id;

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.content;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success btn-sm';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => {
      completeTask(task.id, taskText, taskItem);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id, taskItem);
    });

    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(deleteBtn);
    taskItem.appendChild(taskText);
    taskItem.appendChild(btnGroup);
    tasksList.appendChild(taskItem);
  }

  function completeTask(taskId, taskText, taskItem) {
    $.ajax({
      type: 'PUT',
      url: `api/tasks/${taskId}/mark_complete?api_key=1`,
      success: function() {
        taskItem.remove();
        addCompletedTaskToList(taskText.textContent, taskId);
      },
      error: function(error) {
        console.error("Failed to complete task:", error);
      }
    });
  }

  function addCompletedTaskToList(text, id) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';
    taskItem.dataset.id = id;

    const taskText = document.createElement('span');
    taskText.className = 'task-text completed';
    taskText.textContent = text;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(id, taskItem);
    });

    btnGroup.appendChild(deleteBtn);
    taskItem.appendChild(taskText);
    taskItem.appendChild(btnGroup);
    completedTasksList.appendChild(taskItem);
  }

  function deleteTask(taskId, taskItem) {
    $.ajax({
      type: 'DELETE',
      url: `api/tasks/${taskId}?api_key=1`,
      success: function() {
        taskItem.remove();
      },
      error: function(error) {
        console.error("Failed to delete task:", error);
      }
    });
  }
});
