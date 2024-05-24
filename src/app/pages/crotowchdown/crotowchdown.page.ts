import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-crotowchdown',
  templateUrl: './crotowchdown.page.html',
  styleUrls: ['./crotowchdown.page.scss'],
})
export class CrotowchdownPage implements OnInit {
  idJuego: any;

  logoEquL: string;
  nomEquL: string;
  logoEquV: string;
  nomEquV: string

  puntos: string = "6";
  numanota: string = "";
  numlanza: string = "";
  accionGuardar: string = "Guardar";
  listAnotaciones: any = [];
  equipo: string = "visitante";
  iditemedit: string = "";
  timeTab: string = "";
  down: number = 0;
  tiempo: string = "";
  medio: string = "";
  idReg: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  /* Cargar información inicial de las anotaciones */
  async ngOnInit() {
    this.idJuego = await this.storageService.get('idjuego');
    this.logoEquL = await this.storageService.get('logoEquL');
    this.nomEquL = await this.storageService.get('nomEquL');
    this.logoEquV = await this.storageService.get('logoEquV');
    this.nomEquV = await this.storageService.get('nomEquV');
 
    this.route.params.subscribe(params => {
      if (params) {
        //console.log(params);
        this.tiempo = params['tiempo'];
        this.medio = params['medio'];
        this.down = params['down'];
        this.equipo = params['equipo'];
        this.idReg = params['idreg'];
      }
    });
    this.fncInfoEquipo();
  }
  /* Guarda la información nueva o editada */
  async guardaAnotacion() {
    if (this.accionGuardar === "MODIFICAR ANOTACIÓN") {
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        if (value === this.iditemedit) {
          const rec1 = {
            'iditem':value,
            'feho':key.feho,
            'timecurrent':key.timecurrent,
            'grp':key.grp,
            'acc':key.acc,
            'idjuego':key.idJuego,
            'tiempo':key.tiempo,
            'medio':key.medio,
            'down':key.down,
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
      const _timecurrent = this.getCurrentDayTimestamp(dt);
      const _grp = 'AC';
      const _acc = 'TW';
      const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
      //const key1 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'iditem':key1,
        'feho':dt,
        'timecurrent':_timecurrent,
        'grp':_grp,
        'acc':_acc,
        'idjuego':this.idJuego,
        'tiempo':this.tiempo,
        'medio':this.medio,
        'down':this.down,
        'equipo':this.equipo,
        'puntos': parseFloat(this.puntos.toString()),
        'numanota':this.numanota,
        'numlanza':this.numlanza,
        'idItercepcion':''
      };
      //console.log(rec1);
      await this.storageService.set(key1, rec1);
    }

    this.numanota = "";
    this.numlanza = "";
    this.router.navigate(['/cronome']);
  }
  /* Retorna la fecha y hora actual en numeros */
  getCurrentDayTimestamp(dt:any) {
    return dt.getFullYear() + ''
    + (dt.getMonth() + 1).toString().padStart(2, '0') + ''
    + dt.getDate().toString().padStart(2, '0') + ''
    + dt.getHours().toString().padStart(2, '0') + ''
    + dt.getMinutes().toString().padStart(2, '0') + ''
    + dt.getSeconds().toString().padStart(2, '0');
  }
  /* Actualiza el listado de anotaciones del equipo seleccionado */
  async fncInfoEquipo() {
    this.listAnotaciones = [];
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'AC' && array[2] === 'TW') {
        if (this.equipo === key.equipo) {
          this.listAnotaciones.push(key);
        }
      }
    });
  }
  /* Actualizar campos para hacer una edición de la información */
  editarAnotacion(_key:any) {
    this.accionGuardar = "MODIFICAR ANOTACIÓN"
    this.iditemedit = _key.iditem;
    var _idreg = _key.feho;
    this.puntos = _key.puntos.toString();
    this.numanota = _key.numanota;
    this.numlanza = _key.numlanza;
  }
  /* Eliminar el registro seleccionado */
  async borraAnotacion(_key:any) {
    this.iditemedit = _key.iditem;
    await this.storageService.remove(this.iditemedit);
    this.router.navigate(['/cronome']);
  }

}
