//import { StorageService } from './../../service/storage.service';
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
  value: any;

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
    //var todayDate = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    var todayDate = now
    console.log('todayDate: ' + todayDate);

    const key1 = '135|' + this.getCurrentDayTimestamp();
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
    await this.storageService.list();
  }

}
