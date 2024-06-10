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
        // Propriedades relacionadas ao cronômetro
        currentTime?: number; // Tempo decorrido do cronômetro em segundos
        timer?: any; // Referência para o setInterval
        timerRunning?: boolean; // Indica se o cronômetro está em execução
        startTime?: number;
}
