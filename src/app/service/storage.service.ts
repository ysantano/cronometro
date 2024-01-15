import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    let result = await this._storage?.set(key, value);
    console.log(result);
  }

  public async get(key: string) {
    let value = await this._storage?.get(key);
    console.log(value);
    return value;
  }

  public async remove(key: string) {
    let value = await this._storage?.remove(key);
  }

  public async clear() {
    let value = await this._storage?.clear();
  }

  public async keys() {
    let value = await this._storage?.keys();
    console.log(value);
    return value;
  }

  public async length() {
    let value = await this._storage?.length();
    console.log(value);
    return value;
  }

  public async list() {
    return this._storage;
    /*
    var value = '';
    await this._storage?.forEach((key, value, index) => {
      const array = value.split('|');
      //console.log('value: ' + value + ' index: ' + index);
      if (array[1] == 'AC') {
        switch(array[2]) {
          case "CT":
            console.log('Acción: ' + array[2] +" Castigo!");
            console.log(key);

            value += '<b>CASTIGO</b>';

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
    });
    console.log('cadena: ' + value);
    return value;
    */
  }

}
