import { Project } from "./project";
import { User } from "./user";

export interface Task {
    taskId?: number;
    name?: string;
    description?: string;
    status?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    project?: Project;
    assignedTo?: User;
  }
