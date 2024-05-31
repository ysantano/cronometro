import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Device, DevicePlugin } from '@capacitor/device';

@Component({
  selector: 'app-cronome',
  templateUrl: './cronome.page.html',
  styleUrls: ['./cronome.page.scss'],
})
export class CronomePage implements OnInit {
  idDevice: string | undefined;

  idJuego: any;
  dataJuego: any;

  idTempRolJue: string;
  nombreLiga: string;
  logoLiga: string;
  idLiga: string;
  nomCampo: string;
  fecJug: string;
  horJug: string;
  eqLocal: string;
  ptsLocal: string;
  nomEquL: string;
  logoEquL: string;
  recordLoc: string;
  eqVisita: string;
  ptsVisita: string;
  nomEquV: string;
  logoEquV: string;
  recordVis: string;
  idCampo: string;
  idJornada: string;
  nomTor: string;
  finalizado: string;
  nomCat: string;


  equipo: string = "visitante";
  sVisitante: string = "00";
  sLocal: string = "00";
  down: string = "0";
  tiempo: string = "00:00";
  timeTab: string = "T1";
  iconBottonPlayPause: string = "caret-forward-outline";

  pausado = true;
  idReg: number = 1;
  intervalId:any;

  minutosInputT1: number = 0;
  segundosInputT1: number = 0;
  minutosInputMT: number = 0;
  segundosInputMT: number = 0;
  minutosInputT2: number = 0;
  segundosInputT2: number = 0;
  tiempoRestante: number = 0;
  ptosLocal: number = 0;
  ptosVisitante: number = 0;
  puntos: string = "6";

  vTF1: boolean = true;
  vTF2: boolean = true;
  lTF1: boolean = true;
  lTF2: boolean = true;

  ctrlCronometro: boolean = false;
  ctrlEstadisticas: boolean = false;

  alertButtons = ['Aceptar'];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService,
    private apiService: ApiService
  ) { }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
    });
    await toast.present();
  }

  async ngOnInit() {
    const _idDevice = await Device.getId();
    this.idDevice = _idDevice.identifier;
    this.idJuego = await this.storageService.get('idjuego');

    console.log('idDevice: ',this.idDevice);

    //console.log("idJuego", this.idJuego);
    //console.log('cronome.jsonDataJuegos => ', this.apiService.jsonDataJuegos);

    const data = this.filtrarPorIdTempRolJue(this.apiService.jsonDataJuegos, this.idJuego);
    this.dataJuego = data;

    this.idTempRolJue = this.dataJuego.idTempRolJue;
    this.nombreLiga = this.dataJuego.nombreLiga;
    this.logoLiga = this.dataJuego.logoLiga;
    this.idLiga = this.dataJuego.idLiga;
    this.nomCampo = this.dataJuego.nomCampo;
    this.fecJug = this.dataJuego.fecJug;
    this.horJug = this.dataJuego.horJug;
    this.eqLocal = this.dataJuego.eqLocal;
    this.ptsLocal = this.dataJuego.ptsLocal;
    this.nomEquL = this.dataJuego.nomEquL;
    this.logoEquL = this.dataJuego.logoEquL;
    this.recordLoc = this.dataJuego.recordLoc;
    this.eqVisita = this.dataJuego.eqVisita;
    this.ptsVisita = this.dataJuego.ptsVisita;
    this.nomEquV = this.dataJuego.nomEquV;
    this.logoEquV = this.dataJuego.logoEquV;
    this.recordVis = this.dataJuego.recordVis;
    this.idCampo = this.dataJuego.idCampo;
    this.idJornada = this.dataJuego.idJornada;
    this.nomTor = this.dataJuego.nomTor;
    this.finalizado = this.dataJuego.finalizado;
    this.nomCat = this.dataJuego.nomCat;
    await this.storageService.set('logoEquL', this.logoEquL);
    await this.storageService.set('nomEquL', this.nomEquL);
    await this.storageService.set('logoEquV', this.logoEquV);
    await this.storageService.set('nomEquV', this.nomEquV);

    this.tiempoRestante = 0;

    this.minutosInputT1 = 5;
    this.segundosInputT1 = 0;
    this.minutosInputMT = 2;
    this.segundosInputMT = 0;
    this.minutosInputT2 = 5;
    this.segundosInputT2 = 0;

    if (this.timeTab == "T1") {
      this.tiempo = `${String(this.minutosInputT1).padStart(2, "0")}:${String(this.segundosInputT1).padStart(2, "0")}`;
    } else if (this.timeTab == "MT") {
      this.tiempo = `${String(this.minutosInputMT).padStart(2, "0")}:${String(this.segundosInputMT).padStart(2, "0")}`;
    } else if (this.timeTab == "T2") {
      this.tiempo = `${String(this.minutosInputT2).padStart(2, "0")}:${String(this.segundosInputT2).padStart(2, "0")}`;
    }

    this.ptosLocal = 0;
    this.ptosVisitante = 0;
    this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
    this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;
    this.down = "0";
    this.puntos = "6";

    this.vTF1 = true;
    this.vTF2 = true;
    this.lTF1 = true;
    this.lTF2 = true;

    this.ctrlCronometro = false;
    this.ctrlEstadisticas = false;
  }

  /* FUNCIONAMIENTO DEL CRONOMETRO */
  async iniciarCronometro() {
    if (this.pausado) {
      //console.log("Inicia el conteo!");
      this.pausado = false;
      this.iconBottonPlayPause = "pause-outline";

      const dt = new Date();
      const _timecurrent = this.getCurrentDayTimestamp(dt);
      const _grp = 'CR';
      const _acc = 'PY';
      const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
      const rec1 = {
        'idDevice':this.idDevice,
        'iditem':key1,
        'feho':dt,
        'timecurrent':_timecurrent,
        'grp':_grp,
        'acc':_acc,
        'idjuego':this.idJuego,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':Number(this.down),
        'equipo':this.equipo
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;

      this.intervalId = setInterval(() => {
        this.actualizarCronometro();
      }, 1000);
    } else {
      //console.log("Pausar el conteo!");
      this.pausado = true;
      this.iconBottonPlayPause = "caret-forward-outline";
      //this.equipo = "visitante"

      const dt = new Date();
      const _timecurrent = this.getCurrentDayTimestamp(dt);
      const _grp = 'CR';
      const _acc = 'PA';
      const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
      const rec1 = {
        'idDevice':this.idDevice,
        'iditem':key1,
        'feho':dt,
        'timecurrent':_timecurrent,
        'grp':_grp,
        'acc':_acc,
        'idjuego':this.idJuego,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':Number(this.down),
        'equipo':this.equipo
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;

      clearInterval(this.intervalId);
    }
  }
  getCurrentDayTimestamp(dt:any) {
    return dt.getFullYear() + ''
    + (dt.getMonth() + 1).toString().padStart(2, '0') + ''
    + dt.getDate().toString().padStart(2, '0') + ''
    + dt.getHours().toString().padStart(2, '0') + ''
    + dt.getMinutes().toString().padStart(2, '0') + ''
    + dt.getSeconds().toString().padStart(2, '0');
  }
  actualizarCronometro() {
    if (this.timeTab == "T1") {
      if (this.segundosInputT1 <=0) {
        this.segundosInputT1 = 59;
        this.minutosInputT1 -= 1;
      } else {
        this.segundosInputT1 -= 1;
      }
      this.tiempo = `${String(this.minutosInputT1).padStart(2, "0")}:${String(this.segundosInputT1).padStart(2, "0")}`;
      if (this.minutosInputT1 == 0 && this.segundosInputT1 == 0) {
        clearInterval(this.intervalId);
        this.presentToast('bottom','Fin primer tiempo!');

        this.pausado = true;
        this.iconBottonPlayPause = "caret-forward-outline";
        this.timeTab = "MT";
        this.updateTimeT1();
      }

    } else if (this.timeTab == "MT") {
      if (this.segundosInputMT <=0) {
        this.segundosInputMT = 59;
        this.minutosInputMT -= 1;
      } else {
        this.segundosInputMT -= 1;
      }
      this.tiempo = `${String(this.minutosInputMT).padStart(2, "0")}:${String(this.segundosInputMT).padStart(2, "0")}`;
      if (this.minutosInputMT == 0 && this.segundosInputMT == 0) {
        clearInterval(this.intervalId);
        this.presentToast('bottom','Final de descanso!');

        this.pausado = true;
        this.iconBottonPlayPause = "caret-forward-outline";
          this.timeTab = "T2";
        this.updateTimeT1();
      }

    } else if (this.timeTab == "T2") {
      if (this.segundosInputT2 <=0) {
        this.segundosInputT2 = 59;
        this.minutosInputT2 -= 1;
      } else {
        this.segundosInputT2 -= 1;
      }
      this.tiempo = `${String(this.minutosInputT2).padStart(2, "0")}:${String(this.segundosInputT2).padStart(2, "0")}`;
      if (this.minutosInputT2 == 0 && this.segundosInputT2 == 0) {
        clearInterval(this.intervalId);
        this.presentToast('bottom','Juego teriminado!');

        this.pausado = true;
        this.iconBottonPlayPause = "caret-forward-outline";
        this.timeTab = "T1";
        this.updateTimeT1();
      }
    }
  }
  updateTimeT1() {
    if (this.timeTab == "T1") {
      this.tiempo = `${String(this.minutosInputT1).padStart(2, "0")}:${String(this.segundosInputT1).padStart(2, "0")}`;
    } else if (this.timeTab == "MT") {
      this.tiempo = `${String(this.minutosInputMT).padStart(2, "0")}:${String(this.segundosInputMT).padStart(2, "0")}`;
    } else if (this.timeTab == "T2") {
      this.tiempo = `${String(this.minutosInputT2).padStart(2, "0")}:${String(this.segundosInputT2).padStart(2, "0")}`;
    }
  }

  /* FUNCIONAMIENTO DE AVANZAR AL SIGUIENTE DOWN */
  fncNextDown() {
    var _down = Number(this.down);
    _down ++;
    this.down = _down.toString();
    if (_down > 4) {
      this.down = "0";
    };
    this.fncChangeDown();
  }
  fncLastDown() {
    var _down = Number(this.down);
    _down --;
    this.down = _down.toString();
    if (_down < 0) {
      this.down = "4";
    };
    this.fncChangeDown();
  }

  /* ACTUALIZA EL CAMBIO DEL EQUIPO */
  async fncChangeTeam() {
    const dt = new Date();
    const _timecurrent = this.getCurrentDayTimestamp(dt);
    const _grp = 'CR';
    const _acc = 'TM';
    const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
    const rec1 = {
      'idDevice':this.idDevice,
      'iditem':key1,
      'feho':dt,
      'timecurrent':_timecurrent,
      'grp':_grp,
      'acc':_acc,
      'idjuego':this.idJuego,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':Number(this.down),
      'equipo':this.equipo
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;
  }

  /* ACTUALIZAR CUANDO SE HACE CAMBIO DE DOWN */
  async fncChangeDown() {
    const dt = new Date();
    const _timecurrent = this.getCurrentDayTimestamp(dt);
    const _grp = 'CR';
    const _acc = 'DW';
    const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
    const rec1 = {
      'idDevice':this.idDevice,
      'iditem':key1,
      'feho':dt,
      'timecurrent':_timecurrent,
      'grp':_grp,
      'acc':_acc,
      'idjuego':this.idJuego,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':Number(this.down),
      'equipo':this.equipo
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;
  }

  /*  CARGAR LA PAGUINA SEGÚN LA ACCIÓN SELECCIONADA */
  goCroconfig() {
    const informacion = {
      idJuego: this.idJuego,
      equipo: this.equipo,
      down:Number(this.down),
      timeTab:this.timeTab,
      minutosInputT1: this.minutosInputT1,
      segundosInputT1: this.segundosInputT1,
      minutosInputMT: this.minutosInputMT,
      segundosInputMT: this.segundosInputMT,
      minutosInputT2: this.minutosInputT2,
      segundosInputT2: this.segundosInputT2,
      vTF1: this.vTF1,
      vTF2: this.vTF2,
      lTF1: this.lTF1,
      lTF2: this.lTF2,
      idreg: this.idReg,
      ctrlCronometro: this.ctrlCronometro,
      ctrlEstadisticas: this.ctrlEstadisticas
    };
    this.router.navigate(['/croconfig', informacion]);
  }

  goTowchdown() {
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:Number(this.down),
      equipo: this.equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crotowchdown', informacion]);
  }

  goCastigos() {
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:Number(this.down),
      equipo: this.equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crocastigos', informacion]);
  }

  goIntercepciones() {
    var _equipo = 'local';
    if (this.equipo === _equipo) {
      _equipo = 'visitante';
    }else{
      _equipo = 'local';
    }
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:Number(this.down),
      equipo: _equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crointercepciones', informacion]);
  }

  goCaptura() {
    var _equipo = 'local';
    if (this.equipo === _equipo) {
      _equipo = 'visitante';
    }else{
      _equipo = 'local';
    }
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:Number(this.down),
      equipo: _equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crocapturas', informacion]);
  }

  estadisticasFinales() {
    var _equipo = 'local';
    if (this.ptosVisitante > this.ptosLocal) {
      _equipo = 'visitante';
    }
    const informacion = {
      equipo: _equipo, //this.equipo,
    };
    this.router.navigate(['/estadisticasfinales', informacion]);
  }

  filtrarPorIdTempRolJue(data: any, id: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].idTempRolJue === id) {
        return data[i];
      }
    }
    return null;
  }

  async ionViewDidEnter() {
    console.log('Actualizar el cronómetro!');

    this.idReg = 0;
    this.ptosLocal = 0;
    this.ptosVisitante = 0;

    const _listStorage = await this.storageService.list();
    await _listStorage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');

      if (array[1] === 'AC' && array[2] === 'TW') {
        if (key.equipo === 'visitante'){
          this.ptosVisitante += key.puntos;
        }else{
          this.ptosLocal += key.puntos;
        }
      }

      if (array[1] === 'DG' && array[2] === 'BK') {
        this.equipo = key.equipo;
        this.timeTab = key.timeTab;
        this.minutosInputT1 = key.minutosInputT1;
        this.segundosInputT1 = key.segundosInputT1;
        this.minutosInputMT = key.minutosInputMT;
        this.segundosInputMT = key.segundosInputMT;
        this.minutosInputT2 = key.minutosInputT2;
        this.segundosInputT2 = key.segundosInputT2;
        if (this.timeTab == "T1") {
          this.tiempo = `${String(this.minutosInputT1).padStart(2, "0")}:${String(this.segundosInputT1).padStart(2, "0")}`;
        } else if (this.timeTab == "MT") {
          this.tiempo = `${String(this.minutosInputMT).padStart(2, "0")}:${String(this.segundosInputMT).padStart(2, "0")}`;
        } else if (this.timeTab == "T2") {
          this.tiempo = `${String(this.minutosInputT2).padStart(2, "0")}:${String(this.segundosInputT2).padStart(2, "0")}`;
        }
        this.vTF1 = key.vTF1;
        this.vTF2 = key.vTF2;
        this.lTF1 = key.lTF1;
        this.lTF2 = key.lTF2;

        this.ctrlCronometro = key.ctrlCronometro;
        this.ctrlEstadisticas = key.ctrlEstadisticas;

        console.log('ctrlCronometro', this.ctrlCronometro);
        console.log('ctrlEstadisticas', this.ctrlEstadisticas);

      }
      this.idReg++;
    })

    this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
    this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;

  }

  async ionViewWillLeave() {
    // Guardar variables del juego.
    const dt = new Date();
    const _timecurrent = this.getCurrentDayTimestamp(dt);
    const _grp = 'DG';
    const _acc = 'BK';
    var key1 =  this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;

    const rec1 = {
      'idDevice':this.idDevice,
      'iditem':key1,
      'feho':dt,
      'timecurrent':_timecurrent,
      'grp':_grp,
      'acc':_acc,
      'idjuego':this.idJuego,
      'equipo':this.equipo,
      'down':Number(this.down),
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
      'lTF2':this.lTF2,
      'ctrlCronometro':this.ctrlCronometro,
      'ctrlEstadisticas':this.ctrlEstadisticas
    };
    const _listStorage = await this.storageService.list();
    await _listStorage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'DG' && array[2] === 'BK') {
        key1 = value;
      }
    })
    await this.storageService.set(key1, rec1);

    console.log('Actualizar el marcador de la ficha principal!');

    this.dataJuego.ptsLocal = this.sLocal;
    this.dataJuego.ptsVisita = this.sVisitante;

    console.log('dataJuego=>', this.dataJuego);

  }

  async fncTiempFuera(_tiefur: any) {
    const dt = new Date();
    const _timecurrent = this.getCurrentDayTimestamp(dt);
    const _grp = 'CR';
    const _acc = 'TF';
    const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
    const rec1 = {
      'idDevice':this.idDevice,
      'iditem':key1,
      'feho':dt,
      'timecurrent':_timecurrent,
      'grp':_grp,
      'acc':_acc,
      'idjuego':this.idJuego,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':Number(this.down),
      'equipo':this.equipo,
      'tiefue':_tiefur
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;
  }



/*
  ionViewWillEnter() {
    console.log('funcion: ionViewWillEnter()');
  }
  ionViewDidLeave() {
    console.log('funcion: ionViewDidLeave()');
  }
  ionViewDidEnter() {
    console.log('funcion: ionViewDidEnter()');
  }
  ionViewWillLeave() {
    console.log('funcion: ionViewWillLeave()');
  }
*/
}
