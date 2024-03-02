import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crointercepciones',
  templateUrl: './crointercepciones.page.html',
  styleUrls: ['./crointercepciones.page.scss'],
})
export class CrointercepcionesPage implements OnInit {

  njintercepta: string = "";
  interanota: boolean = false;
  njinteranota: string = "";
  ptsintercepta: number = 0;
  accionGuardar: string = "Guardar";
  listIntercepciones: any = [];
  equipo: string = "visitante";

  constructor() { }

  ngOnInit() {
  }

  fncInterAnota() {
  }

  guardaIntercepcion() {
  }

  editarIntercepcion(item:any) {
  }

  borraIntercepcion(item:any) {
  }

  fncInfoEquipo() {
  }

}
