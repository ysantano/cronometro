import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-croconfig',
  templateUrl: './croconfig.page.html',
  styleUrls: ['./croconfig.page.scss'],
})
export class CroconfigPage implements OnInit {
  _equipo: string = "";
  _down: number = 0;
  _idreg: number = 0;

  timeTab: string = "T1";
  minutosInputT1: number = 21;
  segundosInputT1: number = 1;
  minutosInputMT: number = 10;
  segundosInputMT: number = 0;
  minutosInputT2: number = 22;
  segundosInputT2: number = 2;

  vTF1: boolean = true;
  vTF2: boolean = true;
  lTF1: boolean = true;
  lTF2: boolean = true;

  _params:any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    //console.log('Inicio de configiración!');
    this.route.params.subscribe(params => {
      if (params) {
        this._params = params;
        //console.log(params);
        this._equipo = params['equipo'];
        this._down = params['down'];
        this.timeTab = params['timeTab'];
        this._idreg = params['idreg'];
        this.minutosInputT1 = params['minutosInputT1'];
        this.segundosInputT1 = params['segundosInputT1'];
        this.minutosInputMT = params['minutosInputMT'];
        this.segundosInputMT = params['segundosInputMT'];
        this.minutosInputT2 = params['minutosInputT2'];
        this.segundosInputT2 = params['segundosInputT2'];
        this.vTF1 = params['vTF1'];
        this.vTF2 = params['vTF2'];
        this.lTF1 = params['lTF1'];
        this.lTF2 = params['lTF2'];
      }
    });
  }

  resetCronometroActivo() {
    if (this.timeTab == "T1") {
      this.minutosInputT1 = 21;
      this.segundosInputT1 = 1;
    } else if (this.timeTab == "MT") {
      this.minutosInputMT = 10;
      this.segundosInputMT = 0;
    } else if (this.timeTab == "T2") {
      this.minutosInputT2 = 22;
      this.segundosInputT2 = 2;
    }
  }

  async guardarDatos() {
    const dt = new Date();
    var key1 =  this._idreg + '|DG|BK|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'equipo':this._equipo,
      'down':this._down,
      'timeTab':this.timeTab,
      'minutosInputT1':this.minutosInputT1,
      'segundosInputT1':this.segundosInputT1,
      'minutosInputMT':this.minutosInputMT,
      'segundosInputMT':this.segundosInputMT,
      'minutosInputT2':this.minutosInputT2,
      'segundosInputT2':this.segundosInputT2,
      'vTF1':this.vTF1,
      'vTF2':this.vTF2,
      'lTF1':this.lTF1,
      'lTF2':this.lTF2  
    };
    const _listStorage = await this.storageService.list();
    await _listStorage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'DG' && array[2] === 'BK') {
        key1 = value;
      }
    })
    await this.storageService.set(key1, rec1);
    this.router.navigate(['/cronome']);
  }

  getCurrentDayTimestamp(dt:any) {
    return dt.getFullYear() + ''
    + (dt.getMonth() + 1).toString().padStart(2, '0') + ''
    + dt.getDate().toString().padStart(2, '0') + ''
    + dt.getHours().toString().padStart(2, '0') + ''
    + dt.getMinutes().toString().padStart(2, '0') + ''
    + dt.getSeconds().toString().padStart(2, '0');
  }

  async ionViewWillLeave() {
    console.log('funcion: ionViewWillLeave()');
    const dt = new Date();
    var key1 =  this._idreg + '|DG|BK|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'equipo':this._params['equipo'],
      'down':this._params['down'],
      'timeTab':this._params['timeTab'],
      'minutosInputT1':this._params['minutosInputT1'],
      'segundosInputT1':this._params['segundosInputT1'],
      'minutosInputMT':this._params['minutosInputMT'],
      'segundosInputMT':this._params['segundosInputMT'],
      'minutosInputT2':this._params['minutosInputT2'],
      'segundosInputT2':this._params['segundosInputT2'],
      'vTF1':String(this.vTF1),
      'vTF2':String(this.vTF2),
      'lTF1':String(this.lTF1),
      'lTF2':String(this.lTF2)  
    };
    const _listStorage = await this.storageService.list();
    await _listStorage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'DG' && array[2] === 'BK') {
        key1 = value;
      }
    });
    await this.storageService.set(key1, rec1);

  }

}
