import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  credentials = { email: '', password: '' };
  errorMessage = '';

  showPassword: boolean = false;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        const token = response.data.token; // Asegúrate de que el token esté en la estructura de respuesta correcta
        localStorage.setItem('token', token);
  
        this.authService.handleLoginResponse(response);
      },
      error => {
        this.errorMessage = 'Credenciales inválidas. Por favor, intenta nuevamente.';
        console.error('Error en el inicio de sesión:', error);
      }
    );
  }
}
