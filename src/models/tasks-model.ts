import type { TaskData } from "../interfaces/interfaces";

export class Task implements TaskData{
  id: string
  task: string
  taskCompleted: boolean

  constructor(task: string, taskCompleted: boolean = false){
    this.id = crypto.randomUUID(),
    this.task = task,
    this.taskCompleted = taskCompleted
  }
}