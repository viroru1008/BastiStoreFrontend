import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  titulo = 'Formulario Clientes'
  cliente: Cliente = new Cliente();
  error: any;
  constructor(private clienteServicio: ClienteService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.clienteServicio.ver(id).subscribe(cliente => this.cliente = cliente);
      }
    });
  }

  crear(): void{
    this.clienteServicio.crear(this.cliente).subscribe(cliente => {
      swal.fire('Cliente Creado', `El Cliente ${cliente.name} fue creado con éxito`, 'success');
      this.router.navigate(['/clientes']);
    }, err => {
      if(err.status == 400){
        this.error = err.error;
      }
    });
  }

  editar(): void{
    this.clienteServicio.editar(this.cliente).subscribe(cliente => {
      swal.fire('Cliente Modificado', `El Cliente ${cliente.name} fue actualizado con éxito`, 'success');
      this.router.navigate(['/clientes']);
    }, err => {
      if(err.status == 400){
        this.error = err.error;
      }
    })
  }

}
