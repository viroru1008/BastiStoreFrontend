import { Cliente } from "./cliente";
import { Ventaproducto } from "./ventaproducto";

export class Venta {
  saleId: number;
  clientId: number;
  active: boolean;
  purchaseValue: number;
  creationDate: string;
  client: Cliente;
  saleProducts: Ventaproducto[] = [];
}
