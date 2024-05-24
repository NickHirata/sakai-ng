import { Component } from '@angular/core';
import { AuthService, UserRegistrationData } from 'src/app/demo/service/auth.service';
import { SelectItem } from 'primeng/api'; // Importando SelectItem do PrimeNG

@Component({
    templateUrl: './formlayoutdemo.component.html',
})
export class FormLayoutDemoComponent {
    userData: UserRegistrationData = {
        name: '',
        email: '',
        password: '',
        type: ''
    };

    dropdownItems: SelectItem[] = [
        { label: 'Usuário', value: 'user' },
        { label: 'Administrador', value: 'admin' }
    ];

    selectedState: any = null;
    password: string = '';

    constructor(private authService: AuthService) {}

    onSubmit() {
        this.userData.type = this.selectedState ? this.selectedState.value : '';
        this.userData.password = this.password;

        this.authService.registerUser(this.userData)
            .subscribe(
                response => {
                    console.log('Usuário registrado com sucesso:', response);
                    // Lógica para redirecionar ou exibir mensagem de sucesso
                },
                error => {
                    console.error('Erro ao registrar usuário:', error);
                    // Lógica para exibir mensagem de erro
                }
            );
    }
}
