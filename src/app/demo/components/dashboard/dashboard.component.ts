import { Router, RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Impediment } from '../../api/impediment';
import { Project } from '../../api/project';
import { ProjectService } from '../../service/project.service';
import { ImpedimentService } from '../../service/impediment.service';
import { TaskService } from '../../service/task.service';
import { Task } from '../../api/task';
import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    impediments: Impediment[] = [];
    impediment: Impediment = {};
    projects: Project[] = [];
    project: Project = {};
    private taskSubscription: Subscription;
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
    ) {

    }
    ngOnDestroy(): void {

    }

    ngOnInit() {
        this.projectService.getProjects().subscribe(data => this.projects = data);
        this.impedimentService.getImpediments().subscribe(data => {
            this.impediments = data;

        })

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


}
