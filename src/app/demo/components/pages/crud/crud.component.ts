import { ImpedimentService } from './../../../service/impediment.service';
import { Impediment } from './../../../api/impediment';
import { ProjectService } from './../../../service/project.service';
import { User } from './../../../api/user';
import { UserService } from './../../../service/user.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Task } from 'src/app/demo/api/task';
import { TaskService } from 'src/app/demo/service/task.service';
import { Project } from 'src/app/demo/api/project';
import { Observable, Subscription } from 'rxjs';
import { Team } from 'src/app/demo/api/team';
import { TeamService } from 'src/app/demo/service/team.service';


@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {
    userSelecionado: User = {};
    projetoSelecionado: Project = {};
    projectSelecionado: Project = {};
    time: Team = {};
    times: Team[] = [];
    taskSelecionado: Task = {};
    dropdownItems = [
        { name: 'Administrador', code: 'a' },
        { name: 'Desenvolvedor', code: 'd' }
    ];
    tarefaDialog: boolean = false;

    impedimentoDialog: boolean = false;
    deleteTasksDialog: boolean = false;
    deleteTaskDialog: boolean = false;
    tasks: Task[] = [];
    impediments: Impediment[] = [];
    users: User[] = [];
    projects: Project[] = [];
    task: Task = {};
    impediment: Impediment = {};
    project: Project = {};
    selectedTasks: Task[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    private taskSubscription: Subscription;
    userLogado: any = this.userService.getUser();
    constructor(private taskService: TaskService, private userService: UserService,
         private projectService: ProjectService, private messageService: MessageService,
        private impedimentService: ImpedimentService, private teamService: TeamService) { }

    ngOnInit() {
        this.userService.getUsers().subscribe(data => this.users = data);
        this.projectService.getProjects().subscribe(data => this.projects = data);
        // this.taskService.getTasks().subscribe(data => this.tasks = data);
        this.taskService.getTasksByProject(this.projetoSelecionado.project_id).subscribe(data => this.tasks = data);
        this.impedimentService.getImpediments().subscribe(data => this.impediments = data);
        this.teamService.getTeams().subscribe(data => this.times = data)
        this.loadProjectsAndUsers();

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' },
            { field: 'assignedTo', header: 'Assigned To' },
            { field: 'deadline', header: 'Deadline' }
        ];

        this.statuses = [
            { label: 'PENDENTE', value: 'pendente' },
            { label: 'DESENVOLVENDO', value: 'desenvolvendo' },
            { label: 'CONCLUÍDO', value: 'concluído' },
            { label: 'AGUARDANDO', value: 'aguardando' }
        ];



    }

    loadProjectsAndUsers() {
        this.userService.getUsers().subscribe(data => this.users = data);
        this.projectService.getProjects().subscribe(data => {
            this.projects = data;
            if (this.projects.length > 0) {
                this.projetoSelecionado = this.projects[0]; // Seleciona o primeiro projeto por padrão
                this.loadTasks(this.projetoSelecionado.project_id); // Carrega as tarefas do projeto selecionado
            }
        });
        this.impedimentService.getImpediments().subscribe(data => this.impediments = data);
    }

    loadTasks(projectId: number): void {
        this.taskService.getTasksByProject(projectId).subscribe(data => {
            this.tasks = data;
            // Inicializa o currentTime com o tempo decorrido das tarefas
            this.tasks.forEach(task => {
                if (task.timerRunning) {
                    task.currentTime = Math.floor((Date.now() - task.startTime) / 1000);
                    this.startTimer(task); // Inicia o timer se a tarefa estiver em execução
                }
            });
        });
    }

    pauseTimer(task: Task) {
        // Pausa o cronômetro apenas se estiver rodando
        if (task.timerRunning && task.timer) {
            clearInterval(task.timer);
            task.timerRunning = false;
            task.currentTime = Math.floor((Date.now() - task.startTime) / 1000); // Salva o tempo decorrido
            this.updateTimerDisplay(task); // Atualiza o tempo na tela
        }
    }

    startTimer(task: Task) {
        // Inicia o cronômetro apenas se não estiver rodando
        if (!task.timerRunning) {
            task.startTime = Date.now() - (task.currentTime || 0) * 1000; // Ajusta o tempo inicial com base no tempo decorrido
            task.timerRunning = true;
            task.timer = setInterval(() => {
                task.currentTime = Math.floor((Date.now() - task.startTime) / 1000); // Atualiza o tempo decorrido
                this.updateTimerDisplay(task); // Atualiza o tempo na tela
            }, 1000);
        }
    }

    updateTimerDisplay(task: Task) {
        // Atualiza o tempo na tela
        const formattedTime = this.formatTime(task.currentTime);
        const timerElement = document.getElementById('timer-' + task.task_id);
        if (timerElement) {
            timerElement.textContent = formattedTime;
        }
    }



    completeTask(task: Task) {
        this.pauseTimer(task); // Pausa o cronômetro ao concluir a tarefa
        task.status = 'CONCLUÍDO'; // Muda o status da tarefa para "CONCLUÍDO"

        // Aqui você pode adicionar a lógica para atualizar a tarefa no servidor, se necessário

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Completed', life: 3000 });
    }


    formatTime(seconds: number): string {
        const hours: number = Math.floor(seconds / 3600);
        const minutes: number = Math.floor((seconds % 3600) / 60);
        const secs: number = seconds % 60;
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
    }

    pad(val: number): string {
        return val < 10 ? '0' + val : val.toString();
    }

    onProjectChange(event: any): void {
        if (this.projetoSelecionado && this.projetoSelecionado.project_id) {
          this.loadTasks(this.projetoSelecionado.project_id);
        }
      }

    openTarefa() {
        this.task = {};
        this.submitted = false;
        this.tarefaDialog = true;


    }

 
    openImpedimento() {
        this.task = {};
        this.submitted = false;
        this.impedimentoDialog = true;
    }

    deleteSelectedTasks() {
        this.deleteTasksDialog = true;
    }

    editTask(task: Task) {
        this.task = { ...task };
        this.tarefaDialog = true;
    }

    deleteTask(task: Task) {
        this.deleteTaskDialog = true;
        this.task = { ...task };
    }

    confirmDeleteSelected() {
        this.deleteTasksDialog = false;
        this.tasks = this.tasks.filter(val => !this.selectedTasks.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tasks Deleted', life: 3000 });
        this.selectedTasks = [];
    }

    confirmDelete() {
        this.deleteTaskDialog = false;
        this.tasks = this.tasks.filter(val => val.task_id !== this.task.task_id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Deleted', life: 3000 });
        this.task = {};
    }

    hideDialog() {
        this.tarefaDialog = false;
        this.impedimentoDialog = false;
        this.submitted = false;
    }

    savetask() {
        this.submitted = true;

        if (this.task.name?.trim()) {
            if (this.task.task_id) {
                this.tasks[this.findIndexById(this.task.task_id)] = this.task;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Updated', life: 3000 });
            } else {
                this.task.task_id = this.createId();
                this.task.last_update = new Date();
                this.task.timer = 0;
                if (this.projetoSelecionado && this.projetoSelecionado.project_id) {
                    this.task.project_id = this.projetoSelecionado.project_id;
                }
                if (this.userSelecionado && this.userSelecionado.id) {
                    this.task.assigned_to = this.userSelecionado.id;
                }

                this.taskService.addTask(this.task).subscribe((newTask: Task) => {
                    this.tasks.push(newTask);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Created', life: 3000 });
                });
            }

            this.tasks = [...this.tasks];
            this.tarefaDialog = false;
            this.task = {};
        }
    }

    onTaskSelect(event: any) {
        this.taskSelecionado = event.value;
    }


    saveImpediment() {
        this.submitted = true;

        if (this.impediment.description?.trim()) {
            if (this.impediment.id) {
                this.impediments[this.findIndexByIdImpedimento(this.impediment.id)] = this.impediment;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Impediment Updated', life: 3000 });
            } else {
                this.impediment.id = this.createId();
                if (this.taskSelecionado && this.taskSelecionado.task_id) {
                    console.log('Task ID:', this.taskSelecionado.task_id);
                    this.impediment.task_id = this.taskSelecionado.task_id;
                }
                this.impedimentService.addImpediment(this.impediment).subscribe((newImpediment: Impediment) => {
                    this.impediments.push(newImpediment);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Impediment Created', life: 3000 });
                });
            }

            this.impediments = [...this.impediments];
            this.impedimentoDialog = false;
            this.impediment = {};
        }
    }






    getTaskName(taskId: number): Observable<string> {
        return new Observable((observer) => {
            if (this.taskSubscription) {
                this.taskSubscription.unsubscribe();
            }
            this.taskSubscription = this.taskService.getTaskById(taskId).subscribe(
                (task) => {
                    if (task) {
                        observer.next(task.name);
                    } else {
                        observer.next('Tarefa não encontrada');
                    }
                    observer.complete();
                },
                (error) => {
                    observer.error('Erro ao buscar tarefa');
                }
            );
        });
    }

    findIndexById(id: number): number {
        return this.tasks.findIndex(task => task.task_id === id);
    }

    findIndexByIdImpedimento(id: number): number {
        return this.impediments.findIndex(impediment => impediment.id === id);
    }

    createId(): number {
        const min = 10000; // Minimum 5-digit number
        const max = 99999; // Maximum 5-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }



}
