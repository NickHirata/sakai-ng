import { Component } from '@angular/core';
import { AuthService } from 'src/app/demo/service/auth.service';
import { UserRegistrationData } from 'src/app/demo/service/auth.service';

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

    constructor(private authService: AuthService) {}


  onSubmit() {
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

    password!: string;

}
