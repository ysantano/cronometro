import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/service/sqlite.service';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})

export class JuegoPage implements OnInit {

  isModalOpen = false;
  accionJugada: string = "";
  imgAccion: string = "";

  equipo: string = "visitante"
  ptosLocal: number = 0;
  ptosVisitante: number = 0;
  sLocal: string = "";
  sVisitante: string = "";
  down: number = 1;


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

  constructor(
    private toastController: ToastController,
    private sqliteService: SqliteService
  ) {
    this.sqliteService.insertData();
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

  iniciarCronometro() {
    if (this.pausado) {
      console.log("Inicia el conteo!");
      this.pausado = false;
      this.iconBottonPlayPause = "pause-outline";
      //this.equipo = "local"
      this.intervalId = setInterval(() => {
        this.actualizarCronometro();
      }, 1000);
    } else {
      console.log("Pausar el conteo!");
      this.pausado = true;
      this.iconBottonPlayPause = "caret-forward-outline";
      //this.equipo = "visitante"
      clearInterval(this.intervalId);
    }
  }

  fncNextDown() {
    this.down ++;
    if (this.down > 4) {
      this.down = 1;
    }
  }

  fncLastDown() {
    this.down --;
    if (this.down < 1) {
      this.down = 4;
    }
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

  openActionModal(id:number, isOpen: boolean) {
    console.log("Acción : " + id);
    this.accionJugada = "";
    switch(id) {
      case 1:
        this.accionJugada = "Anotación!";
        this.imgAccion = "anotacion";
        break;
      case 2:
        this.accionJugada = "Castigo!";
        this.imgAccion = "castigo";
        break;
      case 3:
        this.accionJugada = "Intercepción!";
        this.imgAccion = "intersepcion";
        break;
      case 4:
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

  borraAnotacion() {
    alert("Borrar registro de anotación!");
  }

}

