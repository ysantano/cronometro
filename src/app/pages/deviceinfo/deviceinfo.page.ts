import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

import { Device, DevicePlugin } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Network, ConnectionStatus } from '@capacitor/network';

import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';


@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.page.html',
  styleUrls: ['./deviceinfo.page.scss'],
})
export class DeviceinfoPage implements OnInit {
  networkStatus: ConnectionStatus | undefined;
  screenOrientation: String | undefined;
  getId: string | undefined;

  di_isVirtual?: boolean | null;
  di_manufacturer?: string | null;
  di_model?: string | null;
  di_operatingSystem?: string | null;
  di_osVersion?: string | null;
  di_platform?: string | null;
  di_webViewVersion?: string | null;

  dv_getBatteryInfoLevel?: number | null;
  dv_getBatteryInfoCharg?: boolean | null;
  dv_getLanguageCode?: string | null;
  dv_getLanguageTag?: string | null;

  gl_accuracy?: number | null;
  gl_altitude?: number | null;
  gl_altitudeAccuracy?: number | null;
  gl_heading?: number | null;
  gl_latitude?: number | null;
  gl_longitude?: number | null;
  gl_speed?: number | null;

  gl_toExponential?: string | null;
  gl_toFixed?: string | null;
  gl_toLocaleString?: string | null;
  gl_toPrecision?: string | null;
  gl_toString?: string | null;
  gl_valueOf?: number | null;

  pr_coarseLocation?: string;
  pr_location?: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    /*
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });
    */
  }

  async ngOnInit() {
    console.log('Dentro de page.deviceinfo');
    //console.log('Network: ', Network);


    if(Network) {
      Network.getStatus().then((status)=>{
        this.networkStatus = status;
      })
    }
    Network.addListener("networkStatusChange", status=>{
      this.networkStatus=status;
    })

    const sOrientation = await ScreenOrientation.getCurrentOrientation();
    this.screenOrientation = sOrientation.type;

    const _getId = await Device.getId();
    this.getId = _getId.identifier

    const _getInfo = await Device.getInfo();
    this.di_isVirtual = _getInfo.isVirtual;
    this.di_manufacturer = _getInfo.manufacturer;
    this.di_model = _getInfo.model;
    this.di_operatingSystem = _getInfo.operatingSystem;
    this.di_osVersion = _getInfo.osVersion;
    this.di_platform = _getInfo.platform;
    this.di_webViewVersion = _getInfo.webViewVersion;

    const _getBatteryInfo = await Device.getBatteryInfo();
    this.dv_getBatteryInfoLevel = _getBatteryInfo.batteryLevel;
    this.dv_getBatteryInfoCharg = _getBatteryInfo.isCharging;

    const _getLanguageCode = await Device.getLanguageCode();
    this.dv_getLanguageCode = _getLanguageCode.value;

    const _getLanguageTag = await Device.getLanguageTag();
    this.dv_getLanguageTag = _getLanguageTag.value;

    const opciones = {
      enableHighAccuracy: true
    };
    const getCurrentPosition = await Geolocation.getCurrentPosition(opciones);
    this.gl_accuracy = getCurrentPosition.coords.accuracy;
    this.gl_altitude = getCurrentPosition.coords.altitude;
    this.gl_altitudeAccuracy = getCurrentPosition.coords.altitudeAccuracy;
    this.gl_heading = getCurrentPosition.coords.heading;
    this.gl_latitude = getCurrentPosition.coords.latitude;
    this.gl_longitude = getCurrentPosition.coords.longitude;
    this.gl_speed = getCurrentPosition.coords.speed;

    this.gl_toExponential = getCurrentPosition.timestamp.toExponential();
    this.gl_toFixed = getCurrentPosition.timestamp.toFixed();
    this.gl_toLocaleString = getCurrentPosition.timestamp.toLocaleString();
    this.gl_toPrecision = getCurrentPosition.timestamp.toPrecision();
    this.gl_toString = getCurrentPosition.timestamp.toString();
    this.gl_valueOf = getCurrentPosition.timestamp.valueOf();

    const checkPermissions = await Geolocation.checkPermissions();
    this.pr_coarseLocation = checkPermissions.coarseLocation;
    this.pr_location = checkPermissions.location;



  }

}
