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
  
    constructor(public layoutService: LayoutService, private loginService: LoginService, private router: Router) { }
  
    login() {
      this.loginService.login(this.email, this.password).subscribe(
        (response) => {
          this.user = response; 
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Erro ao autenticar:', error);
        }
      );
    }



}
