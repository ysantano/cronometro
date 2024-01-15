import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/service/sqlite.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})

export class JuegoPage implements OnInit {

  private _listStorage: any | null = null;
  listAnotaciones: any = [];
  listCastigos: any = [];
  listIntercepciones: any = [];
  listCapturas: any = [];

  idReg: number = 1;

  isModalOpen = false;
  accionJugada: string = "";
  imgAccion: string = "";

  equipo: string = "visitante"
  ptosLocal: number = 0;
  ptosVisitante: number = 0;
  sLocal: string = "";
  sVisitante: string = "";
  down: number = 1;
  puntos: number = 6;
  numanota: string = "";
  numlanza: string = "";
  njcastigo: string = "";
  njintercepta: string = "";
  njinteranota: string = "";
  ptsintercepta: number = 0;
  njcaptura: string = "";

  timeTab: string = "T1"
  tiempo: string = ""
  tiempoRestante: number = 0;

  minutosInputT1: number = 21;
  segundosInputT1: number = 1;
  minutosInputMT: number = 10;
  segundosInputMT: number = 0;
  minutosInputT2: number = 22;
  segundosInputT2: number = 2;

  pausado = true;
  intervalId:any;

  iconBottonPlayPause: string = "caret-forward-outline";

  idcastigo: number = 0;
  castigos: any = [
    {'id':1, 'castigo':'Fuera de juego'},
    {'id':2, 'castigo':'Movimiento ilegal'},
    {'id':3, 'castigo':'Contacto ilegal'},
    {'id':4, 'castigo':'Sujetar'},
    {'id':5, 'castigo':'Interferencia en pase'},
    {'id':6, 'castigo':'Bloqueo ilegal'},
    {'id':7, 'castigo':'Proteger la bandera'},
    {'id':8, 'castigo':'Golpear al pasador'},
    {'id':9, 'castigo':'Conducta antideportiva'},
    {'id':10, 'castigo':'Retraso de juego'},
  ];
  interanota: boolean = false;
  capturaPtos: boolean = false;

  constructor(
    private toastController: ToastController,
    private sqliteService: SqliteService,
    private storageService: StorageService
  ) {
    //this.sqliteService.insertData();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
    });
    await toast.present();
  }

  async ngOnInit() {
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
    this.down = 1;
    this.puntos = 6;

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

  getCurrentDayTimestamp(dt:any) {
    //const d = new Date();
    return dt.getFullYear() + ''
    + (dt.getMonth() + 1).toString().padStart(2, '0') + ''
    + dt.getDate().toString().padStart(2, '0') + ''
    + dt.getHours().toString().padStart(2, '0') + ''
    + dt.getMinutes().toString().padStart(2, '0') + ''
    + dt.getSeconds().toString().padStart(2, '0');
  }

  async iniciarCronometro() {
    if (this.pausado) {
      console.log("Inicia el conteo!");
      this.pausado = false;
      this.iconBottonPlayPause = "pause-outline";
      //this.equipo = "local"

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
      console.log("Pausar el conteo!");
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

  fncNextDown() {
    this.down ++;
    if (this.down > 4) {
      this.down = 1;
    };
    this.fncChangeDown();
  }

  fncLastDown() {
    this.down --;
    if (this.down < 1) {
      this.down = 4;
    };
    this.fncChangeDown();
  }

  closeModal(isOpen: boolean) {
    if (this.imgAccion == "config") {
      this.updateTimeT1();
    }
    this.isModalOpen = isOpen;
  }

  resetCronometroActivo() {
    if (this.timeTab == "T1") {
      this.minutosInputT1 = 21;
      this.segundosInputT1 = 1;
      this.tiempo = `${String(this.minutosInputT1).padStart(2, "0")}:${String(this.segundosInputT1).padStart(2, "0")}`;

    } else if (this.timeTab == "MT") {
      this.minutosInputMT = 10;
      this.segundosInputMT = 0;
      this.tiempo = `${String(this.minutosInputMT).padStart(2, "0")}:${String(this.segundosInputMT).padStart(2, "0")}`;

    } else if (this.timeTab == "T2") {
      this.minutosInputT2 = 22;
      this.segundosInputT2 = 2;
      this.tiempo = `${String(this.minutosInputT2).padStart(2, "0")}:${String(this.segundosInputT2).padStart(2, "0")}`;
    }

  }

  async fncInfoEquipo() {
    //console.log('imgAccion: ' + this.imgAccion);

    if (this.imgAccion === 'anotacion') {
      this.listAnotaciones = [];
      await this._listStorage.forEach((key:any, value:any, index:any) => {
        const array = value.split('|');
        if (array[1] === 'AC' && array[2] === 'TW') {
          if (this.equipo === key.equipo) {
            this.listAnotaciones.push(key);
          }
        }
      })
    }

    if (this.imgAccion === 'castigo') {
      this.listCastigos = [];
      await this._listStorage.forEach((key:any, value:any, index:any) => {
        const array = value.split('|');
        if (array[1] === 'AC' && array[2] === 'CT') {
          if (this.equipo === key.equipo) {
            this.listCastigos.push(key);
          }
        }
      })
    }

    if (this.imgAccion === 'intersepcion') {
      this.listIntercepciones = [];
      await this._listStorage.forEach((key:any, value:any, index:any) => {
        const array = value.split('|');
        if (array[1] === 'AC' && array[2] === 'IT') {
          if (this.equipo === key.equipo) {
            this.listIntercepciones.push(key);
          }
        }
      })
    }

    if (this.imgAccion === 'captura') {
      this.listCapturas = [];
      await this._listStorage.forEach((key:any, value:any, index:any) => {
        const array = value.split('|');
        if (array[1] === 'AC' && array[2] === 'KP') {
          if (this.equipo === key.equipo) {
            this.listCapturas.push(key);
          }
        }
      })
    }

  }

  async openActionModal(id:number, isOpen: boolean) {
    console.log("Acción : " + id);

    this._listStorage = await this.storageService.list();
    this.accionJugada = "";

    switch(id) {
      case 1:
        this.listAnotaciones = [];
        await this._listStorage.forEach((key:any, value:any, index:any) => {
          const array = value.split('|');
          if (array[1] === 'AC' && array[2] === 'TW') {
            if (this.equipo === key.equipo) {
              this.listAnotaciones.push(key);
            }
          }
        })

        this.accionJugada = "Anotación!";
        this.imgAccion = "anotacion";
        break;

      case 2:
        this.listCastigos = [];
        await this._listStorage.forEach((key:any, value:any, index:any) => {
          const array = value.split('|');
          if (array[1] === 'AC' && array[2] === 'CT') {
            if (this.equipo === key.equipo) {
              this.listCastigos.push(key);
            }
          }
        })

        this.accionJugada = "Castigo!";
        this.imgAccion = "castigo";
        break;

      case 3:
        if (this.equipo == "local") {
          this.equipo = "visitante";
        }else{
          this.equipo = "local";
        }

        this.listIntercepciones = [];
        await this._listStorage.forEach((key:any, value:any, index:any) => {
          //console.log(value, key);
          const array = value.split('|');
          if (array[1] === 'AC' && array[2] === 'IT') {
            if (this.equipo === key.equipo) {
              this.listIntercepciones.push(key);
            }
          }
        })

        this.accionJugada = "Intercepción!";
        this.imgAccion = "intersepcion";
        break;
      case 4:
        if (this.equipo == "local") {
          this.equipo = "visitante";
        }else{
          this.equipo = "local";
        }

        this.listCapturas = [];
        await this._listStorage.forEach((key:any, value:any, index:any) => {
          //console.log(value, key);
          const array = value.split('|');
          if (array[1] === 'AC' && array[2] === 'KP') {
            if (this.equipo === key.equipo) {
              this.listCapturas.push(key);
            }
          }
        })

        this.accionJugada = "Captura!";
        this.imgAccion = "captura";
        break;
      case 5:
        this.pausado = true;
        this.iconBottonPlayPause = "caret-forward-outline";
        clearInterval(this.intervalId);

        this.accionJugada = "Configuración";
        this.imgAccion = "config";
        break;
    }

    this.isModalOpen = isOpen;

  }

  async fncChangeTeam() {
    const dt = new Date();
    const key1 = this.idReg + '|AC|TM|135|' + this.getCurrentDayTimestamp(dt);
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

  async fncChangeDown() {
    const dt = new Date();
    const key1 = this.idReg + '|AC|DW|135|' + this.getCurrentDayTimestamp(dt);
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

  async guardaCaptura() {
    const dt = new Date();
    const key1 = this.idReg + '|AC|KP|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':this.down,
      'equipo':this.equipo,
      'njcaptura':this.njcaptura
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;

    if (this.capturaPtos) {
      this.ptsintercepta = 2;
      const dt = new Date();
      const key1 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
        'equipo':this.equipo,
        'puntos': parseFloat(this.ptsintercepta.toString()),
        'numanota':this.njcaptura,
        'numlanza':''
      };
      await this.storageService.set(key1, rec1);

      if (this.equipo == "local") {
        var suma = parseFloat(this.ptosLocal.toString()) + parseFloat(this.ptsintercepta.toString());
        this.ptosLocal = suma;
      } else {
        var suma = parseFloat(this.ptosVisitante.toString()) + parseFloat(this.ptsintercepta.toString());
        this.ptosVisitante = suma;
      }
      this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
      this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;
      this.idReg++;
    }
    this.njcaptura = "";
    this.capturaPtos = false;
    this.ptsintercepta = 0;
    this.isModalOpen = false;

  }

  async guardaIntercepcion() {
    const dt = new Date();
    const key1 = this.idReg + '|AC|IT|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':this.down,
      'equipo':this.equipo,
      'njintercepta':this.njintercepta
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;

    //En caso de anotación!
    if (this.interanota) {
      const dt = new Date();
      const key1 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
        'equipo':this.equipo,
        'puntos': parseFloat(this.ptsintercepta.toString()),
        'numanota':this.njinteranota,
        'numlanza':''
      };
      await this.storageService.set(key1, rec1);

      if (this.equipo == "local") {
        var suma = parseFloat(this.ptosLocal.toString()) + parseFloat(this.ptsintercepta.toString());
        this.ptosLocal = suma;
      } else {
        var suma = parseFloat(this.ptosVisitante.toString()) + parseFloat(this.ptsintercepta.toString());
        this.ptosVisitante = suma;
      }
      this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
      this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;
      this.idReg++;
    }

    this.njintercepta = "";
    this.interanota = false;
    this.njinteranota = "";
    this.numlanza = "";
    this.ptsintercepta = 0;
    this.isModalOpen = false;
  }

  async guardaCastigo() {
    const dt = new Date();
    const key1 = this.idReg + '|AC|CT|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':this.down,
      'equipo':this.equipo,
      'njcastigo':this.njcastigo,
      'idcastigo':parseFloat(this.idcastigo.toString())
    };
    await this.storageService.set(key1, rec1);

    this.idReg++;
    this.njcastigo = "";
    this.idcastigo = 0;
    this.isModalOpen = false;
  }

  async guardaAnotacion() {
    const dt = new Date();
    const key1 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'down':this.down,
      'equipo':this.equipo,
      'puntos': parseFloat(this.puntos.toString()),
      'numanota':this.numanota,
      'numlanza':this.numlanza
    };
    await this.storageService.set(key1, rec1);

    if (this.equipo == "local") {
      var suma = parseFloat(this.ptosLocal.toString()) + parseFloat(this.puntos.toString());
      this.ptosLocal = suma;
    } else {
      var suma = parseFloat(this.ptosVisitante.toString()) + parseFloat(this.puntos.toString());
      this.ptosVisitante = suma;
    }
    this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
    this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;

    this.idReg++;
    this.numanota = "";
    this.numlanza = "";
    this.isModalOpen = false;
  }

  borraAnotacion() {
    alert("Borrar registro de anotación!");
  }

  fncInterAnota() {
    this.njinteranota = this.njintercepta;
  }

}

