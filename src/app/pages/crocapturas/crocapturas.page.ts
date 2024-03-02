import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crocapturas',
  templateUrl: './crocapturas.page.html',
  styleUrls: ['./crocapturas.page.scss'],
})
export class CrocapturasPage implements OnInit {

  njcaptura: string = "";
  capturaPtos: boolean = false;
  accionGuardar: string = "Guardar";
  listCapturas: any = [];
  equipo: string = "visitante";

  constructor() { }

  ngOnInit() {
  }

  guardaCaptura() {
  }

  editarCaptura(item:any) {
  }

  fncInfoEquipo() {
  }

}
