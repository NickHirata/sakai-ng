import { ImpedimentService } from './../../../service/impediment.service';
import { Impediment } from './../../../api/impediment';
import { ProjectService } from './../../../service/project.service';
import { User } from './../../../api/user';
import { UserService } from './../../../service/user.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Task } from 'src/app/demo/api/task'; // Importando o modelo de tarefa
import { TaskService } from 'src/app/demo/service/task.service'; // Importando o serviço de tarefa
import { Project } from 'src/app/demo/api/project';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {
    userSelecionado: any = null;
    projetoSelecionado: any = null;
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


    constructor(private taskService: TaskService, private userService: UserService,
         private projectService: ProjectService, private messageService: MessageService,
        private ImpedimentService: ImpedimentService) { }

    ngOnInit() {
        this.userService.getUsers().subscribe(data => this.users = data);
        this.projectService.getProjects().subscribe(data => this.projects = data);
        this.taskService.getTasks().pipe(
            switchMap(tasks => {
                return forkJoin(tasks.map(task => {
                    return this.userService.getUserById(task.assigned_to).pipe(
                        map(user => {
                            if (user) {
                                task.assignedTo = user[0].name;
                            }
                            return task;
                        })
                    );
                }));
            })
        ).subscribe(data => {
            this.tasks = data;
        });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' },
            { field: 'assignedTo', header: 'Assigned To' },
            { field: 'deadline', header: 'Deadline' }
        ];

        this.statuses = [
            { label: 'PENDENTE', value: 'pendente' },
            { label: 'FAZENDO', value: 'fazendo' },
            { label: 'CONCLUIDO', value: 'concluido' },
            { label: 'AGUARDANDO', value: 'aguardando' }
        ];
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
        this.tasks = this.tasks.filter(val => val.taskId !== this.task.taskId);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Deleted', life: 3000 });
        this.task = {};
    }

    hideDialog() {
        this.tarefaDialog = false;
        this.submitted = false;
    }

    savetask() {
        this.submitted = true;

        if (this.task.name?.trim()) {
            if (this.task.taskId) {
                this.tasks[this.findIndexById(this.task.taskId)] = this.task;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Updated', life: 3000 });
            } else {
                this.task.taskId = this.createId();
                this.tasks.push(this.task);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Created', life: 3000 });
            }

            this.tasks = [...this.tasks];
            this.tarefaDialog = false;
            this.task = {};
        }
    }

    saveImpediment(){
        this.submitted = true;
        this.impediment.id = this.createId();
        this.impediments.push(this.impediment);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Impedidomento criado', life: 3000 });
        this.impediments = [...this.impediments];
        this.impedimentoDialog = false;
        this.impediment = {};
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].taskId === id) {
                index = i;
                break;
            }
        }

        return index;
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
