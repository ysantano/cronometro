import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cronome',
  templateUrl: './cronome.page.html',
  styleUrls: ['./cronome.page.scss'],
})
export class CronomePage implements OnInit {

  equipo: string = "visitante"
  sVisitante: string = "00";
  sLocal: string = "00";
  down: string = "0";
  tiempo: string = "00:00";
  timeTab: string = "T1";
  iconBottonPlayPause: string = "caret-forward-outline";

  pausado = true;
  idReg: number = 1;
  intervalId:any;

  minutosInputT1: number = 21;
  segundosInputT1: number = 1;
  minutosInputMT: number = 10;
  segundosInputMT: number = 0;
  minutosInputT2: number = 22;
  segundosInputT2: number = 2;
  tiempoRestante: number = 0;
  ptosLocal: number = 0;
  ptosVisitante: number = 0;
  puntos: string = "6";

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService
  ) { }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
    });
    await toast.present();
  }

  ngOnInit() {
    this.tiempoRestante = 0;

    this.minutosInputT1 = 21;
    this.segundosInputT1 = 1;
    this.minutosInputMT = 10;
    this.segundosInputMT = 0;
    this.minutosInputT2 = 22;
    this.segundosInputT2 = 2;

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

  }

  /* FUNCIONAMIENTO DEL CRONOMETRO */
  async iniciarCronometro() {
    if (this.pausado) {
      //console.log("Inicia el conteo!");
      this.pausado = false;
      this.iconBottonPlayPause = "pause-outline";

      const dt = new Date();
      const key1 = this.idReg + '|CR|PY|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
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
      const key1 = this.idReg + '|CR|PA|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
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
    var _down = parseFloat(this.down);
    _down ++;
    this.down = _down.toString();
    if (_down > 4) {
      this.down = "0";
    };
    this.fncChangeDown();
  }
  fncLastDown() {
    var _down = parseFloat(this.down);
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
    const key1 = this.idReg + '|CR|TM|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':this.down,
      'equipo':this.equipo
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;
  }

  /* ACTUALIZAR CUANDO SE HACE CAMBIO DE DOWN */
  async fncChangeDown() {
    const dt = new Date();
    const key1 = this.idReg + '|CR|DW|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':this.down,
      'equipo':this.equipo
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;
  }

  /*  CARGAR LA PAGUINA SEGÚN LA ACCIÓN SELECCIONADA */
  goCroconfig() {
    const informacion = {
      equipo: this.equipo,
      down:this.down,
      timeTab:this.timeTab,
      minutosInputT1: this.minutosInputT1,
      segundosInputT1: this.segundosInputT1,
      minutosInputMT: this.minutosInputMT,
      segundosInputMT: this.segundosInputMT,
      minutosInputT2: this.minutosInputT2,
      segundosInputT2: this.segundosInputT2,
      idreg: this.idReg
    };
    this.router.navigate(['/croconfig', informacion]);
  }

  goTowchdown() {
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:this.down,
      equipo: this.equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crotowchdown', informacion]);
  }

  goCastigos() {
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:this.down,
      equipo: this.equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crocastigos', informacion]);
  }

  goIntercepciones() {
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:this.down,
      equipo: this.equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crointercepciones', informacion]);
  }

  goCaptura() {
    const informacion = {
      tiempo: this.tiempo,
      medio:this.timeTab,
      down:this.down,
      equipo: this.equipo,
      idreg: this.idReg
    };
    this.router.navigate(['/crocapturas', informacion]);
  }

  estadisticasFinales() {
    this.router.navigate(['/estadisticasfinales']);
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
        console.log('key', key);
        if (key.equipo === 'visitante'){
          this.ptosVisitante += key.puntos;
        }else{
          this.ptosLocal += key.puntos;
        }

      }

      if (array[1] === 'DG' && array[2] === 'BK') {
        //console.log(key);
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
      }

      this.idReg++;
    })

    this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
    this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;

  }

  async ionViewWillLeave() {
    // Guardar variables del juego.
    const dt = new Date();
    var key1 =  this.idReg + '|DG|BK|135|' + this.getCurrentDayTimestamp(dt);

    const rec1 = {
      'feho':dt,
      'equipo':this.equipo,
      'down':this.down,
      'timeTab':this.timeTab,
      'minutosInputT1':this.minutosInputT1,
      'segundosInputT1':this.segundosInputT1,
      'minutosInputMT':this.minutosInputMT,
      'segundosInputMT':this.segundosInputMT,
      'minutosInputT2':this.minutosInputT2,
      'segundosInputT2':this.segundosInputT2
    };
    const _listStorage = await this.storageService.list();
    await _listStorage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'DG' && array[2] === 'BK') {
        key1 = value;
      }
    })
    await this.storageService.set(key1, rec1);


  }



/*
  ionViewWillEnter() {
    console.log('funcion: ionViewWillEnter()');
  }
  ionViewDidEnter() {
    console.log('funcion: ionViewDidEnter()');
  }
  ionViewWillLeave() {
    console.log('funcion: ionViewWillLeave()');
  }
  ionViewDidLeave() {
    console.log('funcion: ionViewDidLeave()');
  }
*/
}
