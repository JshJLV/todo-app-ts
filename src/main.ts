import { Store } from "./store";
import { createHtml } from "./use-cases/createHtml";
import type { DataForm } from "./interfaces/interfaces";

const form = document.querySelector("#form") as HTMLFormElement
const checkboxInput = document.querySelector("#checkbox-task") as HTMLInputElement;
const textInput = document.querySelector("#input-task") as HTMLInputElement;
const todoList = document.querySelector(".to-do-list") as HTMLDivElement;
const clearTodos = document.querySelector("#clear-tasks") as HTMLButtonElement;
const filters = document.querySelector("#filters") as HTMLDivElement;
const darkLightMode = document.querySelector("#button-light-dark") as HTMLButtonElement;
const filterButtons = document.querySelectorAll('.filters-button');
const counter = document.querySelector("#counter-tasks") as HTMLSpanElement;

const handleForm = (e: SubmitEvent) => {
  e.preventDefault()
  const element = e.target
  if(element instanceof HTMLFormElement) {
    const data = Object.fromEntries(new FormData(element)) as unknown as DataForm
    if(!data.task) return
    Store.createTask(data.task, data["checkbox-task"] == 'on')
    renderTasks()
    clearForm()
  }
}

const renderTasks = () => {
  if (!todoList) return;
  todoList.innerHTML = "";
  Store.getFilteredTasks().forEach(task => todoList.appendChild(createHtml(task)));
  updateCompleted()
}

const handleState = (e: Event) => {
  const element = e.target
  if(element instanceof HTMLInputElement){ 
    changeStatusTask(element)
  }

  if(element instanceof HTMLButtonElement){
    delTask(element)
  }
}

const changeStatusTask = (element: HTMLInputElement) => {
  let taskContent = element.parentElement?.nextElementSibling
  taskContent?.classList.toggle("task-completed");
  let id = taskContent?.parentElement?.getAttribute('data-id')
  if(id){
    Store.changeStatus(id)
  }
  updateCompleted()
}

const delTask = (element: HTMLButtonElement) => {
  let id = element.parentElement?.getAttribute('data-id')
  if(id){
    Store.deleteTask(id)
    renderTasks()
  }
  updateCompleted()
}

const deleteCompletedTasks = () => {
  Store.deleteCompleted()
  renderTasks()
}

const filterTasks = (e: Event) => {
  const element = e.target;
  if(element instanceof HTMLButtonElement){
    Store.setFilter(element.value)
    filterButtons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    renderTasks();
  }
}

const updateCompleted = () => {
  counter.textContent = `${Store.getCount()}`
}

const setFilter = () => {
  filterButtons.forEach(btn => {
    if(btn instanceof HTMLButtonElement && btn.value ===  Store.getFilter()){
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  });
}

const clearForm = () => {
  checkboxInput.checked = false
  textInput.value = "";
}

darkLightMode.addEventListener("click", Store.toggleTheme)
form.addEventListener("submit", handleForm)
todoList.addEventListener("click", handleState)
clearTodos.addEventListener("click", deleteCompletedTasks)
filters.addEventListener("click", filterTasks)
document.addEventListener("DOMContentLoaded", () => {
  Store.loadLocalStorage();
  updateCompleted();
  setFilter()
  renderTasks();
})