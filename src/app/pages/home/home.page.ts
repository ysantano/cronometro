import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { StorageService } from 'src/app/service/storage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  listJuegos: any = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    console.log('Dentro de page.home');

    const result = await ScreenOrientation.getCurrentOrientation();

    this.apiService.getDatos().subscribe((response) => {
      // Manejar la respuesta aquí
      this.apiService.jsonDataJuegos = response;
      this.listJuegos = this.apiService.jsonDataJuegos;
      console.log('jsonDataJuegos => ', this.apiService.jsonDataJuegos);
    });

    const getInfo = await Device.getInfo();
    if (getInfo.platform != 'web') {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
      //console.log('Bloquer rotación!');
    }

    /*
    console.log('--- GEOLOCATION ---');
    const opciones = {
      enableHighAccuracy: true
    };
    const getCurrentPosition = await Geolocation.getCurrentPosition(opciones);
    //console.log('getCurrentPosition.timestamp:', getCurrentPosition.timestamp);
    const checkPermissions = await Geolocation.checkPermissions();
    //console.log('checkPermissions:', checkPermissions);
    */

  }

  async goCronometro(idTempRolJue: any) {
    await this.storageService.set('idjuego', idTempRolJue);
    this.router.navigate(['/cronome']);
  }

  fncCronometroJuego() {
    this.router.navigate(['/juego']);
  }

  fncDeviceInfo() {
    this.router.navigate(['/deviceinfo']);
  }

  fncPruebas() {
    this.router.navigate(['/pruebas']);
    //this.router.navigate(['/testsqlite']);
  }

}
