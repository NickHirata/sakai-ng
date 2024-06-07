import { Component, OnInit } from '@angular/core';
import { User } from '../../api/user';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './formlayoutdemo.component.html',
    providers: [MessageService]
    
})
export class FormLayoutDemoComponent implements OnInit{

    constructor(private userService: UserService , private router: Router, private messageService: MessageService) {}
    
    user: User = {};
    users: User[] = [];

    dropdownItems = [
        { name: 'Administrador', code: 'a' },
        { name: 'Desenvolvedor', code: 'd' }
    ];

    submitted: boolean = false;

    password!: string;

    ngOnInit() {
        this.userService.getUsers().subscribe(data => this.users = data);
        
    }
    onSubmit() {
        this.submitted = true;
    
        if (!this.user.name || !this.user.email || !this.user.password || !this.user.type) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios', life: 3000 });
            this.submitted = false;
            return;
        }
    
        const emailExists = this.users.some(u => u.email === this.user.email);
        if (emailExists) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'E-mail já existe', life: 3000 });
            this.submitted = false;
            return;
        }
    
        this.userService.addUser(this.user).subscribe({
            next: (newUser: User) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado', life: 3000 });
                this.users.push(newUser);
                this.user = {};
                this.submitted = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao criar o usuário', life: 3000 });
                this.submitted = false;
            }
        });
        
    }

    voltarParaLogin() {
        this.router.navigate(['/auth/login']);
    }
    
    

}
