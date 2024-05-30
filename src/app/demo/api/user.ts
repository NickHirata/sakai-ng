export interface User {
    id?: number;
    creation_date?: Date;
    email?: string;
    name?: string;
    password?: string;
    type?: string;
}

export interface UserTeam {
    user_id: number;
    team_id: number;
}

