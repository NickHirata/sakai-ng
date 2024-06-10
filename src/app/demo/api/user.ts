export interface User {
    id?: number;
    email?: string;
    username?: string;
    password?: string;
    type?: string;
}

export interface Team {
    teamId: number;
    name: string;
    managerId: Manager;
    projectId: number;
  }

  export interface Manager {
    id: number;
    username: string;
    email: string;
  }

