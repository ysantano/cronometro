import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/service/sqlite.service';
import { StorageService } from 'src/app/service/storage.service';
import { Router } from '@angular/router';

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
  down: string = "0";
  puntos: string = "6";
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
  vistacrono: string = "2";
  accionGuardar: string = "Guardar";
  iditemedit: string = "";

  constructor(
    private router: Router,
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
    this.down = "0";
    this.puntos = "6";

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

  closeModal(isOpen: boolean) {
    if (this.imgAccion == "config") {
      this.updateTimeT1();
    }
    this.isModalOpen = isOpen;
    console.log("vistacrono: ", this.vistacrono);
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
        this.accionGuardar = "Guardar anotación";
        this.iditemedit = "";
        this.puntos = "";
        this.numanota = "";
        this.numlanza = "";

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
        this.accionGuardar = "Guardar castigo";
        this.iditemedit = "";
        this.njcastigo = "";
        this.idcastigo = 0;

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
        this.accionGuardar = "Guardar intercepción";
        this.njintercepta = "";
        this.interanota = false;
        this.njinteranota = "";
        this.numlanza = "";
        this.ptsintercepta = 0;
        if (this.equipo == "local") {
          this.equipo = "visitante";
        }else{
          this.equipo = "local";
        }

        this.listIntercepciones = [];
        await this._listStorage.forEach((key:any, value:any, index:any) => {
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
        this.accionGuardar = "Guardar captura";
        this.njcaptura = "";
        this.capturaPtos = false;
        this.ptsintercepta = 0;
            
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
    if (this.accionGuardar === "MODIFICAR CAPTURA") {
      var _tiempo;
      var _timeTab;
      var _down;
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        if (value === this.iditemedit) {
          console.log(value, key);
          _tiempo = key.tiempo;
          _timeTab = key.timeTab;
          _down = key.down;
          const rec1 = {
            'iditem':value,
            'feho':key.feho,
            'tiempo':key.tiempo,
            'medio':key.medio,
            'down':key.down,
            'equipo':this.equipo,
            'njcaptura':this.njcaptura,
            'capturaPtos':this.capturaPtos
          };
          this.storageService.set(value, rec1);
        }
      });

      var regNew = true;
      await _storage?.forEach((key:any, value:any, index:any) => {
        const array = value.split('|');
        if (array[1] === "AC" && array[2] === "TW") {
          console.log('idCaptura: ' + key.idCaptura, 'iditemedit: ' + this.iditemedit);
          if (key.idCaptura === this.iditemedit) {
            regNew = false;
            if (!this.capturaPtos) {
              this.storageService.remove(key.iditem);
            }
          }
        }
      });

      if (regNew && this.capturaPtos) {
        this.ptsintercepta = 2;
        const dt = new Date();
        const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
          'tiempo':_tiempo,
          'medio':_timeTab,
          'down':_down,
          'equipo':this.equipo,
          'puntos': parseFloat(this.ptsintercepta.toString()),
          'numanota':this.njcaptura,
          'numlanza':'',
          'idCaptura':this.iditemedit
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }



    } else {
      const dt = new Date();
      const key1 = this.idReg + '|AC|KP|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'iditem':key1,
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
        'equipo':this.equipo,
        'njcaptura':this.njcaptura,
        'capturaPtos':this.capturaPtos
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;
  
      if (this.capturaPtos) {
        this.ptsintercepta = 2;
        const dt = new Date();
        const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
          'tiempo':this.tiempo,
          'medio':this.timeTab,
          'down':this.down,
          'equipo':this.equipo,
          'puntos': parseFloat(this.ptsintercepta.toString()),
          'numanota':this.njcaptura,
          'numlanza':'',
          'idCaptura':key1
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }
  
    }
    this.calculaMarcador();

    this.njcaptura = "";
    this.capturaPtos = false;
    this.ptsintercepta = 0;
    this.isModalOpen = false;
  }

  async editarCaptura(_key: any) {
    this.accionGuardar = "MODIFICAR CAPTURA"
    this.iditemedit = _key.iditem;
    this.njcaptura = _key.njcaptura;
    this.capturaPtos = _key.capturaPtos;
  }

  async editarIntercepcion(_key: any) {
    this.accionGuardar = "MODIFICAR INTERCEPCION"
    this.iditemedit = _key.iditem;
    this.njintercepta = _key.njintercepta;
    this.interanota = _key.anota;
    if (_key.anota) {
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any) => {
        const array = value.split('|');
        if (array[1] === 'AC' && array[2] === 'TW') {
          if (this.iditemedit === key.idItercepcion) {
            this.njinteranota = key.numanota;
            this.ptsintercepta = 6; //key.puntos;
            console.log("ptsintercepta: ", this.ptsintercepta);
          }
        }
      });
    }
  }

  editarCastigo(_key:any) {
    this.accionGuardar = "MODIFICAR CASTIGO"
    this.iditemedit = _key.iditem;
    this.njcastigo = _key.njcastigo;
    this.idcastigo = _key.idcastigo;
  }

  async guardaIntercepcion() {
    if (this.accionGuardar === "MODIFICAR INTERCEPCION") {
      var _tiempo;
      var _medio;
      var _down;
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        if (value === this.iditemedit) {
          console.log(value, key);
          _tiempo = key.tiempo
          _medio = key.medio;
          _down = key.down;
          const rec1 = {
            'iditem':value,
            'feho':key.feho,
            'tiempo':key.tiempo,
            'medio':key.medio,
            'down':key.down,
            'equipo':this.equipo,
            'njintercepta':this.njintercepta,
            'anota':this.interanota
          };
          this.storageService.set(value, rec1);
        }
      });

      var regNew = true;
      await _storage?.forEach((key:any, value:any, index:any) => {
        const array = value.split('|');
        if (array[1] === "AC" && array[2] === "TW") {
          if (key.idItercepcion === this.iditemedit) {
            if (this.interanota) {
              const rec2 = {
                'iditem':key.iditem,
                'feho':key.feho,
                'tiempo':key.tiempo,
                'medio':key.timeTab,
                'down':key.down,
                'equipo':this.equipo,
                'puntos': parseFloat(this.ptsintercepta.toString()),
                'numanota':this.njinteranota,
                'numlanza':'',
                'idItercepcion':key.idItercepcion
              };
              this.storageService.set(value, rec2);
              regNew = false;
            }else{
              this.storageService.remove(key.iditem);
              regNew = false;
            }
          }
        }
      });

      if (regNew && this.interanota) {
        const dt = new Date();
        const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
          'tiempo':_tiempo,
          'medio':_medio,
          'down':_down,
          'equipo':this.equipo,
          'puntos': parseFloat(this.ptsintercepta.toString()),
          'numanota':this.njinteranota,
          'numlanza':'',
          'idItercepcion':this.iditemedit
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }


    } else {
      const dt = new Date();
      const key1 = this.idReg + '|AC|IT|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'iditem':key1,
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
        'equipo':this.equipo,
        'njintercepta':this.njintercepta,
        'anota':this.interanota
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;
  
      //En caso de anotación!
      if (this.interanota) {
        const dt = new Date();
        const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
          'tiempo':this.tiempo,
          'medio':this.timeTab,
          'down':this.down,
          'equipo':this.equipo,
          'puntos': parseFloat(this.ptsintercepta.toString()),
          'numanota':this.njinteranota,
          'numlanza':'',
          'idItercepcion':key1
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }
    }
    this.calculaMarcador();

    this.njintercepta = "";
    this.interanota = false;
    this.njinteranota = "";
    this.numlanza = "";
    this.ptsintercepta = 0;
    this.isModalOpen = false;
  }

  async guardaCastigo() {
    console.log("Castigo: ", this.accionGuardar);
    if (this.accionGuardar === "MODIFICAR CASTIGO") {
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        console.log(value, this.iditemedit);
        if (value === this.iditemedit) {
          console.log(value, key);
          const rec1 = {
            'iditem':value,
            'feho':key.feho,
            'tiempo':key.tiempo,
            'medio':key.medio,
            'down':this.down,
            'equipo':this.equipo,
            'njcastigo':this.njcastigo,
            'idcastigo':parseFloat(this.idcastigo.toString())
          };
          this.storageService.set(value, rec1);
        }
      });

    } else {
      const dt = new Date();
      const key1 = this.idReg + '|AC|CT|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'iditem':key1,
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
    }

    this.njcastigo = "";
    this.idcastigo = 0;
    this.isModalOpen = false;
  }

  async calculaMarcador() {
    this.ptosLocal = 0;
    this.ptosVisitante = 0;
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      console.log(value, key);
      const array = value.split('|');
      if (array[1] === "AC" && array[2] === "TW") {
        if (key.equipo == "local") {
          var suma = parseFloat(this.ptosLocal.toString()) + parseFloat(key.puntos);
          this.ptosLocal = suma;
        } else {
          var suma = parseFloat(this.ptosVisitante.toString()) + parseFloat(key.puntos);
          this.ptosVisitante = suma;
        }
      }
      this.sLocal = `${String(this.ptosLocal).padStart(2, "0")}`;
      this.sVisitante = `${String(this.ptosVisitante).padStart(2, "0")}`;
     })
  }

  async guardaAnotacion() {
    if (this.accionGuardar === "MODIFICAR ANOTACIÓN") {
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        if (value === this.iditemedit) {
          const rec1 = {
            'iditem':value,
            'feho':key.feho,
            'tiempo':key.tiempo,
            'medio':key.medio,
            'down':this.down,
            'equipo':this.equipo,
            'puntos': parseFloat(this.puntos.toString()),
            'numanota':this.numanota,
            'numlanza':this.numlanza,
            'idItercepcion':''
          };
          this.storageService.set(value, rec1);  
        }
      });
    } else {
      const dt = new Date();
      const key1 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'iditem':key1,
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.timeTab,
        'down':this.down,
        'equipo':this.equipo,
        'puntos': parseFloat(this.puntos.toString()),
        'numanota':this.numanota,
        'numlanza':this.numlanza,
        'idItercepcion':''
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;
    }
    this.calculaMarcador();

    this.numanota = "";
    this.numlanza = "";
    this.isModalOpen = false;
  }

  editarAnotacion(_key:any) {
    this.accionGuardar = "MODIFICAR ANOTACIÓN"
    //console.log("Editar registro de anotación!");
    //console.log("key: ", _key);
    //console.log("puntos:", _key.puntos);
    this.iditemedit = _key.iditem;
    var _idreg = _key.feho;
    this.puntos = _key.puntos.toString();
    this.numanota = _key.numanota;
    this.numlanza = _key.numlanza;
  }

  async borraIntercepcion(_key:any) {
    this.iditemedit = _key.iditem;
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === "AC" && array[2] === "TW") {
        if (key.idItercepcion === this.iditemedit) {
          this.storageService.remove(key.iditem);
        }
      }
    });
    await this.calculaMarcador();
    await this.storageService.remove(this.iditemedit);
    this.isModalOpen = false;
  }

  async borraAnotacion(_key:any) {
    this.iditemedit = _key.iditem;
    await this.storageService.remove(this.iditemedit);
    await this.calculaMarcador();
    this.isModalOpen = false;
  }

  async borraCastigo(_key:any) {
    console.log("Borrar registro de castigo!");
    console.log("key: ", _key);
    this.iditemedit = _key.iditem;
    console.log("iditemedit: ", this.iditemedit);
    await this.storageService.remove(this.iditemedit);
    this.isModalOpen = false;
  }

  fncInterAnota() {
    this.njinteranota = this.njintercepta;
  }

  async ionViewWillLeave() {
    console.log('guardar estado actual del juego!');
    const dt = new Date();
    const key1 = this.idReg + '|DG|BK|135|' + this.getCurrentDayTimestamp(dt);
    const rec1 = {
      'feho':dt,
      'equipo':this.equipo,
      'down':this.down,
      'tiempo':this.tiempo,
      'medio':this.timeTab,
      'ptsvisita': parseFloat(this.sVisitante.toString()),
      'ptslocal': parseFloat(this.sLocal.toString()),
      'timeTab':this.timeTab,
      't1min':this.minutosInputT1,
      't1seg':this.segundosInputT1,
      'mtmin':this.minutosInputMT,
      'mtseg':this.segundosInputMT,
      't2min':this.minutosInputT2,
      't2seg':this.segundosInputT2,
      'idreg':this.idReg
    };
    await this.storageService.set(key1, rec1);
    this.idReg++;
    //console.log('key1:',key1);
    //console.log('rec1:',rec1);

  }
  async ionViewDidEnter() {
    var _idren = 0;
    var _index = -1;
    this._listStorage = await this.storageService.list();
    await this._listStorage.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'DG' && array[2] === 'BK') {
        //console.log('value: ', value);
        if (parseFloat(array[4].toString()) > _idren) {
          _index = index;
        }
        _idren = parseFloat(array[4].toString());
      }
    });
    await this._listStorage.forEach((key:any, value:any, index:any) => {
      if (index === _index) {
        console.log('value: ', value);
        console.log('key: ', key);

        this.equipo = key.equipo;
        this.down = key.down;
        this.tiempo = key.tiempo;
        this.timeTab = key.medio;
        this.sVisitante = key.ptsvisita;
        this.sLocal = key.ptslocal;
        this.timeTab = key.timeTab;
        this.minutosInputT1 = key.t1min;
        this.segundosInputT1 = key.t1seg;
        this.minutosInputMT = key.mtmin;
        this.segundosInputMT = key.mtseg;
        this.minutosInputT2 = key.t2min;
        this.segundosInputT2 = key.t2seg;
        this.idReg = key.idreg;

      }
    })
    await this.calculaMarcador();

  }

  changeVistaCronometro() {
    this.isModalOpen = false;
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

