import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  titulo = 'Listado de Ventas';
  ventas: Venta[];

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 4;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) pagginador: MatPaginator;

  constructor(private service: VentaService) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  paginar(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos(){
    this.service.listarVentas(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(ventas => {
      this.ventas = ventas.content as Venta[];
      this.totalRegistros = ventas.totalElements as number;
      //this.pagginador._intl.itemsPerPageLabel = 'Registros por Página: ';
    });
  }

  eliminar(venta: Venta): void{

    swal.fire({
      title: 'Cuidado',
      text: `¿Estás seguro de eliminar la venta ${venta.saleId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(venta.saleId).subscribe(() => {
          this.ventas = this.ventas.filter(p => p !== venta);
          swal.fire('Venta Eliminada', `La venta ${venta.saleId} fue eliminada con éxito`, 'success');
        }, err => {
          if(err.status == 500){
            swal.fire('Notificación', `La venta ${venta.saleId} no puede ser eliminada porque tiene ventas asociadas`, 'info');
          }
        });
      }
    });
  }

  cambiarEstado(venta: Venta): void{
    let mensaje: string;
    let mensaje2:string
    if(venta.active){
      mensaje = 'desactivar'
      mensaje2 ='desactivado'
    }else{
      mensaje = 'activar'
      mensaje2 ='activado'
    }

    swal.fire({
      title: 'Cuidado',
      text: `¿Estás seguro de ${mensaje} la venta ${venta.saleId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Si, ${mensaje}!`
    }).then((result) => {
      if (result.isConfirmed) {
        venta.active = !venta.active;
        this.service.editar(venta).subscribe(() => {
          swal.fire('Alert', `La venta ${venta.saleId} fue ${mensaje2} con éxito`, 'success')
        });
      }
    });
  }

}
