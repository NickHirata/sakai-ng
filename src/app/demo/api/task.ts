export interface Task {
    task_id?: number;
    name?: string;
    description?: string;
    creationDate?: Date;
    deadline?: Date;
    end_date?: Date;
    last_update?: Date;
    status?: string;
    project_id?: number;
    assigned_to?: number;
}
