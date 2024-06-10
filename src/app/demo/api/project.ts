// export interface Project {
//     project_id?: number;
//     creation_date?: Date;
//     description?: string;
//     name?: string;
//     status?: string;
// }

import { Team } from "./team";
import { User } from "./user";


export interface Project {
    projectId?: number;
    name?: string;
    description?: string;
    status?: string;
    responsibleId?: User;
    teamId?: Team;
  }
