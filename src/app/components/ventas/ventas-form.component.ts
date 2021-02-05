import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Producto } from 'src/app/models/producto';
import { Venta } from 'src/app/models/venta';
import { Ventaproducto } from 'src/app/models/ventaproducto';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
import { VentaproductoService } from 'src/app/services/ventaproducto.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-ventas-form',
  templateUrl: './ventas-form.component.html',
  styleUrls: ['./ventas-form.component.css']
})
export class VentasFormComponent implements OnInit {

  titulo = 'Crear Venta';
  venta: Venta = new Venta();
  clientes: Cliente[];
  productos: Producto[];
  error: any;

  productoSeleccionado: Producto;
  cantidad: number;

  constructor(private ventaServicio: VentaService, private router: Router, private clienteService: ClienteService, private productoService: ProductoService, private ventaProductoService: VentaproductoService) { }

  ngOnInit(): void {
    this.clienteService.listar().subscribe(clientes => this.clientes = clientes);
    this.productoService.listar().subscribe(productos => this.productos = productos);
  }

  crear(): void{
    let venta = new Venta();

    venta.clientId = this.venta.clientId;
    venta.purchaseValue = this.venta.purchaseValue;

    this.ventaServicio.crear(venta).subscribe(venta => {
      this.venta.saleProducts.map((item: Ventaproducto) => {
        item.saleId = venta.saleId;
        this.ventaProductoService.crear(item).subscribe();
      });

      swal.fire('Venta Creada', `La venta ${venta.saleId} fue creada con éxito`, 'success');
      this.router.navigate(['/ventas']);
    }, err => {
      if(err.status == 400){
        this.error = err.error;
      }
    });
  }

  agregarProducto(): void{
    if(!(this.cantidad > 0 && this.productoSeleccionado)){
      swal.fire('Información', 'No es posible agregar el producto porque faltan campos', 'info');
      return;
    }

    if(this.existeItem(this.productoSeleccionado.productId)){
      this.incrementaCantidad(this.productoSeleccionado.productId, this.cantidad);
    }else{
      let ventaProducto = new Ventaproducto();

      ventaProducto.productId = this.productoSeleccionado.productId;
      ventaProducto.quantity = this.cantidad;
      ventaProducto.product = this.productoSeleccionado;

      this.venta.saleProducts.push(ventaProducto);
    }

    this.cantidad = null;
    this.productoSeleccionado = null;

    return;
  }

  actualizarCantidad(productId: number, event: any): void{
    let cantidad:number = event.target.value as number;
    if(cantidad == 0){
      return this.eliminarProductoFacturado(productId);
    }
    this.venta.saleProducts = this.venta.saleProducts.map((item: Ventaproducto) => {
      if(productId === item.product.productId){
        item.quantity = cantidad;
      }
      return item;
    });
  }

  existeItem(productId: number): boolean{
    let existe = false;
    this.venta.saleProducts.forEach((item: Ventaproducto) => {
      if(productId === item.product.productId){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(productId: number, cantidad: number): void{
    this.venta.saleProducts = this.venta.saleProducts.map((item: Ventaproducto) => {
      if(productId === item.product.productId){
        item.quantity = Number(cantidad) + Number(item.quantity);
      }
      return item;
    });
  }

  eliminarProductoFacturado(productId: number): void{
    this.venta.saleProducts = this.venta.saleProducts.filter((item: Ventaproducto) => productId !== item.productId);
  }

  calcularTotal(): number{
    this.venta.purchaseValue = 0;
    this.venta.saleProducts.forEach((item: Ventaproducto) => {
      this.venta.purchaseValue += (item.product.price * item.quantity);
    });
    return this.venta.purchaseValue;
  }

}
