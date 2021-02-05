import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Iniciar Sesión';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  login(): void{
    if(this.usuario.username == null || this.usuario.password == null){
      swal.fire('Error Login', 'Username o Password vacíos', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      let payload = JSON.parse(atob(response.jwt.split(".")[1]));

      this.authService.guardarUsuario(response.jwt);
      this.authService.guardarToken(response.jwt);

      let usuario = this.authService.usuario;

      this.router.navigate(['/productos']);
      swal.fire(`Bienvenido ${usuario.username}`, 'has Iniciado Sesión', 'info');

    }, err => {
      swal.fire('Error de Credenciales', 'Usuario o Contraseña inválidos', 'error');
    })
  }

}
