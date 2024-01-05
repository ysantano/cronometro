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
    return value;
  }

  public async length() {
    let value = await this._storage?.length();
    console.log(value);
    return value;
  }

  public async list() {
    /*
    this._storage?.forEach((key, value, index) => {
      console.log('key: ' + key + ' value: ' + value + ' index: ' + index);
    });
    */
    this._storage?.forEach((key, value, index) => {
      var datos:[] = key;
      console.log('value: ' + value + ' index: ' + index);
      console.log(datos);

    });

  }

}
