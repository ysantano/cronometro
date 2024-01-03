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

  async setValue() {
    await this.storageService.set('country', 'India');
  }

  async getValue() {
    this.value = await this.storageService.get('country');
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
