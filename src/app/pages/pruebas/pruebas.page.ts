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
  private _storage2: Map<any, any>;

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
    this._storage = await this.storageService.list();
    await this._storage?.forEach((key:any, value:any, index:any) => {
      console.log(value, key);
    })
  }

  async listValueOrder() {
    this._storage = await this.storageService.list();
    this._storage2 = new Map();
    await this._storage?.forEach((value: any, key: any) => {
      var _key = key.split('|');
      value['keyid'] = key;
      value['keyord'] = Number(_key[0]);
      value['keygrp'] = _key[1];
      value['keyact'] = _key[2];
      value['keygam'] = _key[3];
      value['keydat'] = _key[4];
      const keyi = _key[0];
      this._storage2.set(keyi, value);
    });

    const sortedEntries = [...(this._storage2?.entries() || [])].sort(([keyA], [keyB]) => {
      if (Number(keyA) < Number(keyB)) return -1;
      if (Number(keyA) > Number(keyB)) return 1;
      return 0;
    });

    sortedEntries.forEach(([key, value]) => {
      console.log(key, value);
    });
  }

}
