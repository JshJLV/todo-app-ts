import { Task } from "./models/tasks-model";
import type { State } from "./interfaces/interfaces";

const FILTERS_KEYS = {
  all: "all",
  active: "active",
  completed: "completed",
};

const STORAGE_KEYS = {
  tasks: "tasks",
  filter: "filter",
  theme: "theme",
};

const state: State = {
  tasks: [],
  counter: 0,
  filterActive: FILTERS_KEYS.all,
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

  if (filterActive === FILTERS_KEYS.active) {
    return tasks.filter((task) => !task.taskCompleted);
  } else if (filterActive === FILTERS_KEYS.completed) {
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
  updateCounter();
};

const getTasks = () => state.tasks;
const getCount = () => state.counter;
const getFilter = () => state.filterActive;

const toggleTheme = () => {
  const root = document.documentElement;
  const currTheme = root.getAttribute("data-theme");
  const newTheme = currTheme == "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE_KEYS.theme, newTheme);
  root.setAttribute("data-theme", newTheme);
};

const saveOnLocalStorage = () => {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
};

const loadTasksFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.tasks);
  if (stored) {
    state.tasks = JSON.parse(stored) as Task[];
  }
  updateCounter();
};

const loadFilterFromStorage = () => {
  const filterSaved = localStorage.getItem(STORAGE_KEYS.filter);
  if (filterSaved) {
    state.filterActive = filterSaved;
  }
};

const loadLocalStorage = () => {
  loadTasksFromStorage();
  loadFilterFromStorage();

  const themeSaved = localStorage.getItem(STORAGE_KEYS.theme);
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
