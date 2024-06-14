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
import { User, UserTeam } from '../../api/user';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    selectedUsers: User[] = [];
    selectedTeam: any;
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
    userTeams: UserTeam[] = [];
    userLogado: User = {};
    timesUserLogado: Team[] = [];

    constructor(private taskService: TaskService , public layoutService: LayoutService,
        private projectService: ProjectService, private impedimentService: ImpedimentService, private router: Router
        ,private teamService: TeamService, private messageService: MessageService, private userService: UserService
    ) {

    }
    ngOnDestroy(): void {

    }

    ngOnInit() {
        this.userLogado = this.userService.getUser();
        this.projectService.getProjects().subscribe(data => this.projects = data);
        this.userService.getUsers().subscribe(data => this.users = data);
        this.impedimentService.getImpediments().subscribe(data => {
            this.impediments = data;

        })
        this.teamService.getTeams().subscribe(data => this.times = data)
        this.teamService.getUserTeams().subscribe(data => this.userTeams = data)

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus', command: () => this.openImpedimento() }
        ];
        this.taskService.getTasks().subscribe(data => {
            this.tasks = data;
            this.calcularQuantidades();
        });

        this.teamService.getTeamByIdUser(this.userLogado.id).subscribe((userTeams: UserTeam[]) => {
            // Para cada time associado ao usuário logado, encontra os detalhes completos do time
            userTeams.forEach(userTeam => {
                this.teamService.getTimeByID(userTeam.team_id).subscribe((team: Team[]) => {
                    if (team && team.length > 0) { // Verifique se a equipe existe e não está vazia
                        team.forEach(t => {
                            this.timesUserLogado.push(t); // Adicione todos os times
                        });
                    }
                });
            });
        });

    }
    getTaskName(taskId: number): string {
        const task = this.tasks.find(task => task.task_id === taskId);
        return task ? task.name : 'Tarefa não encontrada';
    }

    getProjectName(id: number): string {
        const project = this.projects.find(project => project.project_id === id);
        return project ? project.name : 'Projeto não encontrado';
    }



    getUserName(id: number): string {
        const user = this.users.find(user => user.id === id);
        return user ? user.name : 'Usuário não encontrado';
    }

    calcularQuantidades() {
        this.qtdConcluido = this.tasks.filter(task => task.status.toLowerCase() === 'concluído').length;
        this.qtdDesenvolvimento = this.tasks.filter(task => task.status.toLowerCase() === 'desenvolvendo').length;
        this.qtdPendente = this.tasks.filter(task => task.status.toLowerCase() === 'pendente').length;
    }

    openImpedimento() {
        this.router.navigate(['/pages/crud']);
    }


    onTeamChange(selectedTeam: any) {
        if (selectedTeam) {
            this.time = selectedTeam;
            this.projectSelecionado = this.projects.find(project => project.project_id === selectedTeam.project_id);
            this.teamService.getTeamByID(selectedTeam.team_id).subscribe(userteam => {
                // Mapear apenas os user_id dos membros da equipe e converter para objetos de usuário
                const userIds = userteam.map(ut => ut.user_id);
                this.selectedUsers = this.users.filter(user => userIds.includes(user.id));
            });
        } else {
            this.time = {};
            this.projectSelecionado = {};
            this.selectedUsers = [];
        }
    }

    saveTime() {
        this.submitted = true;
        if (this.time.name?.trim()) {
            if (this.projectSelecionado && this.projectSelecionado.project_id) {
                this.time.project_id = this.projectSelecionado.project_id;
            }

            // Gerar um novo team_id único
            this.time.team_id = this.createId();

            const userTeams = this.selectedUsers.map((user) => ({
                user_id: user.id,
                team_id: this.time.team_id,
            }));

            this.teamService.createTeamWithUsers(this.time, userTeams).subscribe((newTeam) => {
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
