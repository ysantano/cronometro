import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class PruebasPage {
  private _storage: any | null = null;

  detallejuego: any = [];
  value: any;
  resumen: any;

  constructor(
    private storageService: StorageService
  ) { }

  getCurrentDayTimestamp() {
    const d = new Date();
    return d.getFullYear() + ''
    + (d.getMonth() + 1).toString().padStart(2, '0') + ''
    + d.getDate().toString().padStart(2, '0') + ''
    + d.getHours().toString().padStart(2, '0') + ''
    + d.getMinutes().toString().padStart(2, '0') + ''
    + d.getSeconds().toString().padStart(2, '0');
  }

  async setValue() {
    //await this.storageService.set('country', 'India');

    var now = new Date().toLocaleDateString('es-MX');
    var todayDate = now
    //console.log('todayDate: ' + todayDate);

    const key1 = 'CR|135|' + this.getCurrentDayTimestamp();
    const rec1 = {
      'primero':'1',
      'segundo':'2',
      'tercero':'3'
    };
    await this.storageService.set(key1, rec1);

    /*
    const rec2 = {
      'primero':'4',
      'segundo':'5',
      'tercero':'6'
    };
    await this.storageService.set('country2', rec2);
    */
  }

  async getValue() {
    this.value = await this.storageService.get('country1');
    for (const key in this.value) {
      if (this.value.hasOwnProperty(key)) {
        console.log(`${key}: ${this.value[key]}`);
      }
    }
  }

  async removeValue() {
    await this.storageService.remove('country');
  }

  async clearStorage() {
    await this.storageService.clear();
  }

  async keysValue() {
    await this.storageService.keys();
  }

  async lengthValue() {
    this.value = await this.storageService.length();
  }

  async listValue() {
    //this.value = await this.storageService.list();
    //console.log(this.value);

    this._storage = await this.storageService.list();
    await this._storage?.forEach((key:any, value:any, index:any) => {
      console.log(value, key);
    })
  }

  async listValue2() {
    //this.value = await this.storageService.list();
    this.value = '';

    this.detallejuego = [];
    this._storage = await this.storageService.list();
    await this._storage?.forEach((key:any, value:any, index:any) => {
      //console.log(value);
      //console.log(key);
      const array = value.split('|');
      if (array[1] == 'AC') {
        this.detallejuego.push(key);
        switch(array[2]) {
          case "CT":
            //this.detallejuego.push(key);
            break;
        }
      }


      /*
      //console.log('value: ' + value + ' index: ' + index);
      const array = value.split('|');
      //console.log('value: ' + value + ' index: ' + index);
      if (array[1] == 'AC') {
        switch(array[2]) {
          case "CT":
            console.log('Acción: ' + array[2] +" Castigo!");
            console.log(key);
            console.log('--- CASTIGO ---\n\r');
            console.log('Fecha: ' + key.feho + '\n\r');
            console.log('Equipo: ' + key.equipo + '\n\r');
            console.log('Down: ' + key.down + '\n\r');
            console.log('Castigo: ' + key.idcastigo + '\n\r');
            console.log('Medio: ' + key.medio + '\n\r');
            console.log('No.Jugador: ' + key.njcastigo + '\n\r');
            console.log('Tiempo: ' + key.tiempo + '\n\r');
            break;
          case "TW":
            //console.log('Acción: ' + array[2] +" Anotación!");
            //console.log(key);
            break;
          case "KP":
            //console.log('Acción: ' + array[2] +" Captura!");
            //console.log(key);
            break;
          case "IT":
            //console.log('Acción: ' + array[2] +" Intercepción!");
            //console.log(key);
            break;

        }
        //console.log(key);
        //console.log(key.primero + ',' + key.segundo + ',' + key.tercero);
      }
      */
    })
    console.log(this.detallejuego);
    //console.log('cadena: ' + this.value);
  }

}
