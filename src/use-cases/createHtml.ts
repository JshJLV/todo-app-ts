import type { Task } from "../models/tasks-model";

export const createHtml = (newTask: Task) => {
  const taskWrapper = document.createElement("div");
  taskWrapper.classList.add("task");
  taskWrapper.setAttribute("data-id", newTask.id)
  taskWrapper.innerHTML = `
    <div class="wrapper-checkbox">
      <input type="checkbox" name="${newTask.id}" id="${newTask.id}" ${newTask.taskCompleted ? "checked" : ""}/>
      <label for="${newTask.id}" class="checkbox-label"></label>
    </div>
    <p id="task-content" class="task--content ${newTask.taskCompleted ? "task-completed" : ""}">${newTask.task}</p>
    <button id="delete-task" class="delete--task">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path
          fill="#494C6B"
          fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
      </svg>
    </button>
          `;
  return taskWrapper;
};
