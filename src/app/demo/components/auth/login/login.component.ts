import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/demo/api/user';
import { LoginService } from 'src/app/demo/service/login.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    user: User = {}; 
    email: string = '';
    password: string = '';
    valCheck: string[] = ['remember'];
    error: string = ''; 
  
    constructor(public layoutService: LayoutService, private loginService: LoginService, private router: Router) { }
  
    login() {
      this.loginService.login(this.email, this.password).subscribe(
          (response) => {
              if (response) {
                  this.user = response; 
                  console.log(this.user);
                  this.router.navigate(['/dashboard']);
              } else {
                this.error = 'Credenciais incorretas';
              }
          },
          (error) => {
              console.error('Erro ao autenticar:', error);
              this.error = 'Erro ao autenticar';
          }
      );
  }
  clearError() {
    this.error = ''; // Limpa a mensagem de erro
}


}
