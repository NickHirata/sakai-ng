import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
<<<<<<< Updated upstream
import { ProductService } from 'src/app/demo/service/product.service';
=======
import { Task } from 'src/app/demo/api/task';
import { TaskService } from 'src/app/demo/service/task.service';
import { Project } from 'src/app/demo/api/project';
import { Observable, Subscription } from 'rxjs';
import { getLocaleDateFormat } from '@angular/common';

>>>>>>> Stashed changes

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private productService: ProductService, private messageService: MessageService) { }

    ngOnInit() {
<<<<<<< Updated upstream
        this.productService.getProducts().then(data => this.products = data);
=======
        this.userService.getUsers().subscribe(data => this.users = data);
        this.projectService.getProjects().subscribe(data => this.projects = data);
        console.log(this.projects);
        // this.taskService.getTasks().subscribe(data => this.tasks = data);
        this.taskService.getTasksByProject(this.projetoSelecionado.projectId).subscribe(data => this.tasks = data);
        this.impedimentService.getImpediments().subscribe(data => this.impediments = data);
>>>>>>> Stashed changes

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

<<<<<<< Updated upstream
    openNew() {
        this.product = {};
=======
    onProjectChange(event: any): void {
        if (this.projetoSelecionado && this.projetoSelecionado.projectId) {
          this.loadTasks(this.projetoSelecionado.projectId);
        }
      }

      loadTasks(projectId: number): void {
        this.taskService.getTasksByProject(projectId).subscribe(data => {
          this.tasks = data;
        });
      }
    openTarefa() {
        this.task = {};
>>>>>>> Stashed changes
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
<<<<<<< Updated upstream
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
=======
        this.deleteTaskDialog = false;
        this.tasks = this.tasks.filter(val => val.taskId !== this.task.taskId);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Deleted', life: 3000 });
        this.task = {};
>>>>>>> Stashed changes
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

<<<<<<< Updated upstream
        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }
=======
        if (this.task.name?.trim()) {
            if (this.task.taskId) {
                this.tasks[this.findIndexById(this.task.taskId)] = this.task;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Updated', life: 3000 });
            } else {
                if (this.projetoSelecionado && this.projetoSelecionado.projectId) {
                    this.task.project = this.projetoSelecionado;
                }
                if (this.userSelecionado && this.userSelecionado.id) {
                    this.task.assignedTo = this.userSelecionado;
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
                if (this.taskSelecionado && this.taskSelecionado.taskId) {
                    console.log('Task ID:', this.taskSelecionado.taskId);
                    this.impediment.task_id = this.taskSelecionado.taskId;
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

>>>>>>> Stashed changes

        return index;
    }

<<<<<<< Updated upstream
    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
=======
    findIndexById(id: number): number {
        return this.tasks.findIndex(task => task.taskId === id);
>>>>>>> Stashed changes
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
