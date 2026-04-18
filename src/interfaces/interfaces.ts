export interface TaskData {
  id: string
  task: string
  taskCompleted: boolean;
}

export interface DataForm {
  task: string
  "checkbox-task"?: string
}

export interface State {
  tasks: TaskData[],
  counter: number
  filterActive: string
}