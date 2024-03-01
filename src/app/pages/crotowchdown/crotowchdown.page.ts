import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crotowchdown',
  templateUrl: './crotowchdown.page.html',
  styleUrls: ['./crotowchdown.page.scss'],
})
export class CrotowchdownPage implements OnInit {

  puntos: string = "6";
  numanota: string = "";
  numlanza: string = "";
  accionGuardar: string = "Guardar";
  listAnotaciones: any = [];

  constructor() { }

  ngOnInit() {
  }

  guardaAnotacion() {
  }

  editarAnotacion(item:any) {
  }

  borraAnotacion(item:any) {
  }

}
