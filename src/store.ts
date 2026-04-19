import { Task } from "./models/tasks-model";
import type { State } from "./interfaces/interfaces";

const state: State = {
  tasks: [],
  counter: 0,
  filterActive: "all",
};

const filters = {
  all: "all",
  active: "active",
  completed: "completed",
};

const createTask = (taskDescription: string, taskPending: boolean) => {
  const newTask = new Task(taskDescription, taskPending);
  state.tasks.push(newTask);
  updateCounter();
  saveOnLocalStorage();

  return newTask;
};

const changeStatus = (id: string) => {
  state.tasks = state.tasks.map((task) => {
    if (task.id === id) {
      task.taskCompleted = !task.taskCompleted;
    }

    return task;
  });

  saveOnLocalStorage();
  updateCounter();
};

const setFilter = (filter: string) => {
  state.filterActive = filter;
  localStorage.setItem("filter", filter);
};

const getFilteredTasks = () => {
  const { tasks, filterActive } = state;

  if (filterActive === filters.active) {
    return tasks.filter((task) => !task.taskCompleted);
  } else if (filterActive === filters.completed) {
    return tasks.filter((task) => task.taskCompleted);
  }

  return tasks;
};

const updateCounter = () => {
  state.counter = state.tasks.filter((task) => !task.taskCompleted).length;
};

const deleteTask = (id: string) => {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  saveOnLocalStorage();
  updateCounter();
};

const deleteCompleted = () => {
  state.tasks = state.tasks.filter((task) => !task.taskCompleted);
  saveOnLocalStorage();
};

const getTasks = () => state.tasks;
const getCount = () => state.counter;
const getFilter = () => state.filterActive;

const toggleTheme = () => {
  const root = document.documentElement;
  const currTheme = root.getAttribute("data-theme");
  const newTheme = currTheme == "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  root.setAttribute("data-theme", newTheme);
};

const saveOnLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
};

const loadTasksFromStorage = () => {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    state.tasks = JSON.parse(stored) as Task[];
  }
  updateCounter();
};

const loadFilterFromStorage = () => {
  const filterSaved = localStorage.getItem("filter");
  if (filterSaved) {
    state.filterActive = filterSaved;
  }
};

const loadLocalStorage = () => {
  loadTasksFromStorage();
  loadFilterFromStorage();

  const themeSaved = localStorage.getItem("theme");
  if (themeSaved) {
    const root = document.documentElement;
    root.setAttribute("data-theme", themeSaved);
  }
};

export const Store = {
  createTask,
  changeStatus,
  deleteTask,
  deleteCompleted,
  toggleTheme,
  loadLocalStorage,
  getTasks,
  getCount,
  getFilter,
  getFilteredTasks,
  saveOnLocalStorage,
  setFilter,
};
