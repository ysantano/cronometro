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
    const result = await this._storage?.set(key, value);
  }

  public async get(key: string) {
    const result = await this._storage?.get(key);
  }

  public async remove(key: string) {
    const result = await this._storage?.remove(key);
  }

  public async clear() {
    const result = await this._storage?.clear();
  }

  public async keys() {
    const result = await this._storage?.keys()
  }

  public async length() {
    const result = await this._storage?.length()
  }

  public async list() {
    this._storage?.forEach((key, value, index) => {
      console.log('key: ' + key + ' value: ' + value + ' index: ' + index);
    });
  }

}
