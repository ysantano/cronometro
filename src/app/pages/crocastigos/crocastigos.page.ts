import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crocastigos',
  templateUrl: './crocastigos.page.html',
  styleUrls: ['./crocastigos.page.scss'],
})
export class CrocastigosPage implements OnInit {

  njcastigo: string = "";
  idcastigo: number = 0;
  castigos: any = [
    {'id':1, 'castigo':'Fuera de juego'},
    {'id':2, 'castigo':'Movimiento ilegal'},
    {'id':3, 'castigo':'Contacto ilegal'},
    {'id':4, 'castigo':'Sujetar'},
    {'id':5, 'castigo':'Interferencia en pase'},
    {'id':6, 'castigo':'Bloqueo ilegal'},
    {'id':7, 'castigo':'Proteger la bandera'},
    {'id':8, 'castigo':'Golpear al pasador'},
    {'id':9, 'castigo':'Conducta antideportiva'},
    {'id':10, 'castigo':'Retraso de juego'},
  ];
  accionGuardar: string = "Guardar";

  constructor() { }

  ngOnInit() {
  }

  guardaCastigo() {
  }

}
