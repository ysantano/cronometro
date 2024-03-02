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
  _ptosVisitante: number = 0;
  _ptosLocal: number = 0;
  _idreg: number = 0;

  timeTab: string = "T1";
  minutosInputT1: number = 21;
  segundosInputT1: number = 1;
  minutosInputMT: number = 10;
  segundosInputMT: number = 0;
  minutosInputT2: number = 22;
  segundosInputT2: number = 2;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    console.log('Inicio de configiración!');
    this.route.params.subscribe(params => {
      if (params) {
        console.log(params);
        this._equipo = params['equipo'];
        this._down = params['down'];
        this.timeTab = params['timeTab'];
        this._ptosVisitante = params['ptosVisitante'];
        this._ptosLocal = params['ptosLocal'];
        this._idreg = params['idreg'];
        this.minutosInputT1 = params['minutosInputT1'];
        this.segundosInputT1 = params['segundosInputT1'];
        this.minutosInputMT = params['minutosInputMT'];
        this.segundosInputMT = params['segundosInputMT'];
        this.minutosInputT2 = params['minutosInputT2'];
        this.segundosInputT2 = params['segundosInputT2'];
      }
    });
  }

  updateTimeT1() {
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
    console.log('guardar estado actual del juego!');

    const dt = new Date();
    var key1 =  this._idreg + '|DG|BK|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'equipo':this._equipo,
      'down':this._down,
      'ptosVisitante': this._ptosVisitante,
      'ptosLocal': this._ptosLocal,
      'timeTab':this.timeTab,
      't1min':this.minutosInputT1,
      't1seg':this.segundosInputT1,
      'mtmin':this.minutosInputMT,
      'mtseg':this.segundosInputMT,
      't2min':this.minutosInputT2,
      't2seg':this.segundosInputT2,
      'idreg':this._idreg
    };
    const _listStorage = await this.storageService.list();
    await _listStorage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'DG' && array[2] === 'BK') {
        key1 = value;
      }
    })
    await this.storageService.set(key1, rec1);


/*

    const dt = new Date();
    const key1 =  this._idreg + '|DG|BK|135|' + this.getCurrentDayTimestamp(dt);
    console.log('key1: ', key1);
    const rec1 = {
      'feho':dt,
      'equipo':this._equipo,
      'down':this._down,
      'ptosVisitante': this._ptosVisitante,
      'ptosLocal': this._ptosLocal,
      'timeTab':this.timeTab,
      't1min':this.minutosInputT1,
      't1seg':this.segundosInputT1,
      'mtmin':this.minutosInputMT,
      'mtseg':this.segundosInputMT,
      't2min':this.minutosInputT2,
      't2seg':this.segundosInputT2,
      'idreg':this._idreg
    };
    console.log(rec1);
    //await this.storageService.set(key1, rec1);
*/
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

}
