const form = document.querySelector("#form") as HTMLFormElement
const checkboxInput = document.querySelector("#checkbox-task") as HTMLInputElement;
const textInput = document.querySelector("#input-task") as HTMLInputElement;
const todoList = document.querySelector(".to-do-list") as HTMLDivElement;
const clearTodos = document.querySelector("#clear-tasks") as HTMLButtonElement;
const filters = document.querySelector("#filters") as HTMLDivElement;
const counterTasks = document.querySelector("#counter-tasks") as HTMLSpanElement;

interface TaskData {
  task: string;
  'checkbox-task'?: string;
}

const state = {
  completedTasksCounter: 0
}

const handleForm = (e: Event) => {
  e.preventDefault()
  if(e.target instanceof HTMLFormElement) {
    const data = Object.fromEntries(new FormData(e.target))
    if(!data.task) return
    addTask(data);
  }
}

const addTask = (data: TaskData) => {
  const task = document.createElement("div");
  task.classList.add("task");
  let id = crypto.randomUUID()
  let taskCompleted = false
  if(data["checkbox-task"] == "on"){
    taskCompleted = true
    counter(taskCompleted)
  }

  task.innerHTML = `
            <div class="wrapper-checkbox">
              <input type="checkbox" name="${id}" id="${id}" ${taskCompleted ? "checked" : ""}/>
              <label for="${id}" class="checkbox-label"></label>
            </div>
            <p id="task-content" class="task--content ${taskCompleted ? "task-completed" : ''}">${data.task}</p>
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
    todoList.appendChild(task);
  }
  clearForm();
}

const handleState = (e: Event) => {
  const element = e.target
  if(element instanceof HTMLInputElement){
    let taskContent = element.parentElement?.nextElementSibling
    taskContent?.classList.toggle("task-completed");
  }

  if(element instanceof HTMLButtonElement){
    element.parentElement?.remove()
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
    inputChecked.checked ? task.remove() : "";
  })
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

const counter = (taskCompleted: boolean) => {
  state.completedTasksCounter = !taskCompleted ? 
                                state.completedTasksCounter + 1 
                              : state.completedTasksCounter - 1

  counterTasks.textContent = `${state.completedTasksCounter}`
}

form.addEventListener("submit", handleForm)
todoList.addEventListener("click", handleState)
clearTodos.addEventListener("click", deleteCompletedTasks)
filters.addEventListener("click", filterTasks)