import { Router, RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Impediment } from '../../api/impediment';
import { Project } from '../../api/project';
import { ProjectService } from '../../service/project.service';
import { ImpedimentService } from '../../service/impediment.service';
import { TaskService } from '../../service/task.service';
import { Task } from '../../api/task';
import { Observable, Subscription } from 'rxjs';
import { TeamService } from '../../service/team.service';
import { Team } from '../../api/team';
import { UserService } from '../../service/user.service';
import { User } from '../../api/user';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    selectedUsers: User[] = [];
    impediments: Impediment[] = [];
    impediment: Impediment = {};
    projects: Project[] = [];
    project: Project = {};
    projectSelecionado: Project = {};
    timeDialog: boolean = false;
    time: Team = {};
    times: Team[] = [];
    user: User = {};
    users: User[] = [];
    qtdConcluido: number =0 ;
    qtdDesenvolvimento: number = 0;
    qtdPendente: number = 0;
    items!: MenuItem[];
    tasks: Task[] = [];
    task: Task = {};
    impedimentoDialog: boolean = false;
    submitted: boolean = false;
    taskName$: Observable<string | null>;
    

    constructor(private taskService: TaskService , public layoutService: LayoutService,
        private projectService: ProjectService, private impedimentService: ImpedimentService, private router: Router
        ,private teamService: TeamService, private messageService: MessageService, private userService: UserService
    ) {

    }
    ngOnDestroy(): void {

    }

    ngOnInit() {
        this.projectService.getProjects().subscribe(data => this.projects = data);
        this.userService.getUsers().subscribe(data => this.users = data);
        this.impedimentService.getImpediments().subscribe(data => {
            this.impediments = data;

        })
        this.teamService.getTeams().subscribe(data => this.times = data)

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus', command: () => this.openImpedimento() }
        ];
        this.taskService.getTasks().subscribe(data => {
            this.tasks = data;
            this.calcularQuantidades();
        });
    }
    getTaskName(taskId: number): string {
        const task = this.tasks.find(task => task.task_id === taskId);
        return task ? task.name : 'Tarefa não encontrada';
    }
    

    calcularQuantidades() {
        this.qtdConcluido = this.tasks.filter(task => task.status.toLowerCase() === 'concluído').length;
        this.qtdDesenvolvimento = this.tasks.filter(task => task.status.toLowerCase() === 'desenvolvendo').length;
        this.qtdPendente = this.tasks.filter(task => task.status.toLowerCase() === 'pendente').length;
    }

    openImpedimento() {
        this.router.navigate(['/pages/crud']);
    }

    
    saveTime() {
        this.submitted = true;
        if (this.time.name?.trim()) {
          if (this.projectSelecionado && this.projectSelecionado.project_id) {
            this.time.project_id = this.projectSelecionado.project_id;
          }
    
          const userTeams = this.selectedUsers.map(user => ({
            user_id: user.id,
            team_id: this.time.team_id
          }));
    
          this.teamService.createTeamWithUsers(this.time, userTeams).subscribe(newTeam => {
            this.times.push(newTeam);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Created', life: 3000 });
            this.times = [...this.times];
            this.timeDialog = false;
            this.time = {};
            this.selectedUsers = [];
          });
        }
      }
    
    

    createId(): number {
        const min = 10000; // Minimum 5-digit number
        const max = 99999; // Maximum 5-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    openTime() {
        this.time = {};
        this.submitted = false;
        this.timeDialog = true;
    }

    hideDialog() {
        this.timeDialog = false;
        this.submitted = false;
    }


}
