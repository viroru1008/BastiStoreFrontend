import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.css']
})
export class ProductosFormComponent implements OnInit {

  titulo = 'Formulario de Producto'
  producto: Producto = new Producto();
  error: any;
  constructor(private productoServicio: ProductoService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.productoServicio.ver(id).subscribe(producto => this.producto = producto);
      }
    });
  }

  crear(): void{
    this.productoServicio.crear(this.producto).subscribe(producto => {
      swal.fire('Producto Creado', `El producto ${producto.name} fue creado con éxito`, 'success');
      this.router.navigate(['/productos']);
    }, err => {
      if(err.status == 400){
        this.error = err.error;
      }
    });
  }

  editar(): void{
    this.productoServicio.editar(this.producto).subscribe(producto => {
      swal.fire('Producto Modificado', `El producto ${producto.name} fue actualizado con éxito`, 'success');
      this.router.navigate(['/productos']);
    }, err => {
      if(err.status == 400){
        this.error = err.error;
      }
    })
  }

}
