import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  usuario: string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void{
    this.authService.logout();
    swal.fire('Sesión Finalizada', 'Has Cerrado Sesión', 'success');
    this.router.navigate(['/login']);
  }

  authenticado(): boolean{
    if(this.authService.isAuthenticated()){
      this.usuario = this.authService.usuario.username;
      return true;
    }
    return false;
  }

}
