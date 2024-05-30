export interface Task {
    id?: number;
    creation_date?: Date;
    deadline?: Date;
    description?: string;
    end_date?: Date;
    name?: string;
    last_update?: Date;
    status?: string;
    project_id?: number;
    assigned_to?: number;
}
