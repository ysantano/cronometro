import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Network, ConnectionStatus } from '@capacitor/network';

import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  networkStatus: ConnectionStatus | undefined;

  constructor(
    private router: Router,
    private apiService: ApiService,
  )
  {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });
  }

  async ngOnInit() {
    console.log('Dentro de page.home');

    if(Network) {
      Network.getStatus().then((status)=>{
        this.networkStatus = status;
      })
    }
    Network.addListener("networkStatusChange", status=>{
      this.networkStatus=status;
    })

    const result = await ScreenOrientation.getCurrentOrientation();
    console.log('result: ', result);

    this.apiService.getDatos().subscribe((response) => {
      // Manejar la respuesta aquí
      console.log(response);
    });

    console.log('--- DEVICE ---');
    const getId = await Device.getId();
    console.log('getId:', getId);

    const getInfo = await Device.getInfo();
    console.log('getInfo:', getInfo);
    if (getInfo.platform != 'web') {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
      console.log('Bloquer rotación!');
    }

    const getBatteryInfo = await Device.getBatteryInfo();
    console.log('getBatteryInfo:', getBatteryInfo);

    const getLanguageCode = await Device.getLanguageCode();
    console.log('getLanguageCode:', getLanguageCode);

    const getLanguageTag = await Device.getLanguageTag();
    console.log('getLanguageTag:', getLanguageTag);

    console.log('--- GEOLOCATION ---');
    const opciones = {
      enableHighAccuracy: true
    };
    const getCurrentPosition = await Geolocation.getCurrentPosition(opciones);
    console.log('getCurrentPosition.coords:', getCurrentPosition.coords);
    console.log('accuracy:', getCurrentPosition.coords.accuracy);
    console.log('altitude:', getCurrentPosition.coords.altitude);
    console.log('altitudeAccuracy:', getCurrentPosition.coords.altitudeAccuracy);
    console.log('heading:', getCurrentPosition.coords.heading);
    console.log('latitude:', getCurrentPosition.coords.latitude);
    console.log('longitude:', getCurrentPosition.coords.longitude);
    console.log('speed:', getCurrentPosition.coords.speed);
    console.log('getCurrentPosition.timestamp:', getCurrentPosition.timestamp);
    console.log('toExponential:', getCurrentPosition.timestamp.toExponential());
    console.log('toFixed:', getCurrentPosition.timestamp.toFixed());
    console.log('toLocaleString:', getCurrentPosition.timestamp.toLocaleString());
    console.log('toPrecision:', getCurrentPosition.timestamp.toPrecision());
    console.log('toString:', getCurrentPosition.timestamp.toString());
    console.log('valueOf:', getCurrentPosition.timestamp.valueOf());

    const checkPermissions = await Geolocation.checkPermissions();
    console.log('checkPermissions:', checkPermissions);


    console.log('--- Network ---');
    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      console.log('Network status:', status);
    };

  }

  fncCronometroJuego() {
    this.router.navigate(['/juego']);
  }
}
