import { Task } from "./tasks";

const form = document.querySelector("#form") as HTMLFormElement
const checkboxInput = document.querySelector("#checkbox-task") as HTMLInputElement;
const textInput = document.querySelector("#input-task") as HTMLInputElement;
const todoList = document.querySelector(".to-do-list") as HTMLDivElement;
const clearTodos = document.querySelector("#clear-tasks") as HTMLButtonElement;
const filters = document.querySelector("#filters") as HTMLDivElement;
const counterTasks = document.querySelector("#counter-tasks") as HTMLSpanElement;
const darkLightMode = document.querySelector("#button-light-dark") as HTMLButtonElement;

interface TaskData {
  'checkbox-task'?: string;
  task: string
}

const state = {
  completedTasksCounter: 0
}

const handleForm = (e: Event) => {
  e.preventDefault()
  const element = e.target
  if(element instanceof HTMLFormElement) {
    const data = Object.fromEntries(new FormData(element)) as unknown as TaskData
    if(!data.task) return
    const newTask = new Task(data.task, data["checkbox-task"] == 'on')
    addTask(newTask);
  }
}

const addTask = (newTask: Task) => {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task");

  taskContainer.innerHTML = `
            <div class="wrapper-checkbox">
              <input type="checkbox" name="${newTask.id}" id="${newTask.id}" ${newTask.taskCompleted ? "checked" : ""}/>
              <label for="${newTask.id}" class="checkbox-label"></label>
            </div>
            <p id="task-content" class="task--content ${newTask.taskCompleted ? "task-completed" : ''}">${newTask.task}</p>
            <button id="delete-task" class="delete--task">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path
                  fill="#494C6B"
                  fill-rule="evenodd"
                  d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                />
              </svg>
            </button>
          `
  if(todoList instanceof HTMLDivElement) {
    todoList.appendChild(taskContainer);
    state.completedTasksCounter += 1
    updateCounter();
  }
  clearForm();
}

const handleState = (e: Event) => {
  const element = e.target
  console.log(element)
  if(element instanceof HTMLInputElement){
    let taskContent = element.parentElement?.nextElementSibling
    taskContent?.classList.toggle("task-completed");
  }

  if(element instanceof HTMLButtonElement){
    element.parentElement?.remove()
    state.completedTasksCounter -= 1
    updateCounter();
  }
}

const clearForm = () => {
  checkboxInput.checked = false
  textInput.value = "";
}

const deleteCompletedTasks = () => {
  const tasksList = document.querySelectorAll('.task');
  if(tasksList.length == 0) return
  tasksList.forEach(task => {
    let inputChecked = task.firstElementChild?.children[0] as HTMLInputElement
    if(inputChecked.checked) {
      task.remove()
      state.completedTasksCounter -= 1
    }
  })
  updateCounter();
}

const filterTasks = (e: Event) => {
  const tasksList = document.querySelectorAll('.task');

  if(tasksList.length == 0) return

  const element = e.target
  if(element instanceof HTMLButtonElement) {
    const filterValue = element.value;

    // Remove active class from all filter buttons
    const filterButtons = document.querySelectorAll('.filters-button');
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    element.classList.add('active');

    tasksList.forEach(task => {
      // To apply the filters, we first obtain the task value, 
      // whether it is active or not.
      const isCompleted = task.children[1].classList.contains('task-completed');
      // We create a variable to control whether we add an "is-hidden" class
      let shouldShow = false;

      if (filterValue === 'all') {
        shouldShow = true;
      } else if (filterValue === 'active') {
        shouldShow = !isCompleted;
      } else if (filterValue === 'completed') {
        shouldShow = isCompleted;
      }

      task.classList.toggle("is-hidden", !shouldShow);
    })
  }
}

const updateCounter = () => {
  counterTasks.textContent = `${state.completedTasksCounter}`
}

const toggleTheme = () => {
  const root = document.documentElement;
  const currTheme = root.getAttribute("data-theme");
  const newTheme = currTheme == "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  root.setAttribute("data-theme", newTheme);
}

darkLightMode.addEventListener("click", toggleTheme)
form.addEventListener("submit", handleForm)
todoList.addEventListener("click", handleState)
clearTodos.addEventListener("click", deleteCompletedTasks)
filters.addEventListener("click", filterTasks)
document.addEventListener("DOMContentLoaded", () => {
  const themeSaved = localStorage.getItem("theme");
  if(themeSaved){
    const root = document.documentElement;
    root.setAttribute("data-theme", themeSaved);
  }
})