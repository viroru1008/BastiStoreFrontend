import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  titulo = 'Listado de Productos';
  productos: Producto[];

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 4;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) pagginador: MatPaginator;

  constructor(private service: ProductoService) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  paginar(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos(){
    this.service.listarProductos(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(productos => {
      this.productos = productos.content as Producto[];
      this.totalRegistros = productos.totalElements as number;
      //this.pagginador._intl.itemsPerPageLabel = 'Registros por Página: ';
    })
  }

  eliminar(producto: Producto): void{

    swal.fire({
      title: 'Cuidado',
      text: `¿Estás seguro de eliminar el producto ${producto.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(producto.productId).subscribe(() => {
          this.productos = this.productos.filter(p => p !== producto);
          swal.fire('Producto Eliminado', `El producto ${producto.name} fue eliminado con éxito`, 'success');
        }, err => {
          if(err.status == 500){
            swal.fire('Notificación', `El producto ${producto.name} no puede ser eliminado porque tiene ventas asociadas`, 'info');
          }
        });
      }
    });
  }

  cambiarEstado(producto: Producto): void{
    let mensaje: string;
    let mensaje2: string;
    if(producto.active){
      mensaje = 'desactivar'
      mensaje2 ='desactivado'
    }else{
      mensaje = 'activar'
      mensaje2 ='activado'
    
    }

    swal.fire({
      title: 'Cuidado',
      text: `¿Estás seguro de ${mensaje} el producto ${producto.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Si, ${mensaje}!`
    }).then((result) => {
      if (result.isConfirmed) {
        producto.active = !producto.active;
        this.service.editar(producto).subscribe(() => {
          swal.fire('Alert', `El producto ${producto.name} fue ${mensaje2} con éxito`, 'success')
        });
      }
    });
  }
}
