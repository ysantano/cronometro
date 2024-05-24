import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-crointercepciones',
  templateUrl: './crointercepciones.page.html',
  styleUrls: ['./crointercepciones.page.scss'],
})
export class CrointercepcionesPage implements OnInit {

  idJuego: any;
  logoEquL: string;
  nomEquL: string;
  logoEquV: string;
  nomEquV: string

  njintercepta: string = "";
  interanota: boolean = false;
  njinteranota: string = "";
  ptsintercepta: string = "0";
  accionGuardar: string = "Guardar";
  listIntercepciones: any = [];
  equipo: string = "visitante";

  iditemedit: string = "";
  tiempo: string = "";
  medio: string = "";
  down: number = 0;
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
  /* Guardar las intercepciones del equipo seleccionado */
  async guardaIntercepcion() {
    if (this.accionGuardar === "MODIFICAR INTERCEPCION") {
      var _tiempo;
      var _medio;
      var _down;
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        if (value === this.iditemedit) {
          //console.log(value, key);
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
                'timecurrent':key.timecurrent,
                'grp':key.grp,
                'acc':key.acc,
                'idjuego':key.idJuego,
                'tiempo':key.tiempo,
                'medio':key.timeTab,
                'down':key.down,
                'equipo':this.equipo,
                'puntos': Number(this.ptsintercepta),
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
        const _timecurrent = this.getCurrentDayTimestamp(dt);
        const _grp = 'AC';
        const _acc = 'TW';
        const key2 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
        //const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
          'timecurrent':_timecurrent,
          'grp':_grp,
          'acc':_acc,
          'idjuego':this.idJuego,
          'tiempo':_tiempo,
          'medio':_medio,
          'down':_down,
          'equipo':this.equipo,
          'puntos': Number(this.ptsintercepta),
          'numanota':this.njinteranota,
          'numlanza':'',
          'idItercepcion':this.iditemedit
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }

    } else {
      const dt = new Date();
      const _timecurrent = this.getCurrentDayTimestamp(dt);
      const _grp = 'AC';
      const _acc = 'IT';
      const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
      //const key1 = this.idReg + '|AC|IT|135|' + this.getCurrentDayTimestamp(dt);
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
        'njintercepta':this.njintercepta,
        'anota':this.interanota
      };
      console.log('rec1: ',rec1);
      await this.storageService.set(key1, rec1);
      this.idReg++;

      //En caso de anotación!
      if (this.interanota) {
        const dt = new Date();
        const _grp = 'AC';
        const _acc = 'TW';
        const key2 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
        //const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
          'timecurrent':_timecurrent,
          'grp':_grp,
          'acc':_acc,
          'idjuego':this.idJuego,
          'tiempo':this.tiempo,
          'medio':this.medio,
          'down':this.down,
          'equipo':this.equipo,
          'puntos': Number(this.ptsintercepta),
          'numanota':this.njinteranota,
          'numlanza':'',
          'idItercepcion':key1
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }
    }
    this.njintercepta = "";
    this.interanota = false;
    this.njinteranota = "";
    this.ptsintercepta = "0";
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
  /* Poner el número de quién intercepto como defalut para el número de quién anoto */
  fncInterAnota() {
    this.njinteranota = this.njintercepta;
    this.ptsintercepta = "0";
    if (this.interanota) {
      this.ptsintercepta = "6";
    }
  }
  /* Actualizar la información para poder ser editada */
  async editarIntercepcion(_key: any) {
    this.accionGuardar = "MODIFICAR INTERCEPCION"
    this.iditemedit = _key.iditem;
    this.njintercepta = _key.njintercepta;
    this.interanota = _key.anota;
    if (this.interanota) {
      this.njinteranota = _key.njintercepta;
    } 

    if (_key.anota) {
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any) => {
        const array = value.split('|');
        if (array[1] === 'AC' && array[2] === 'TW') {
          if (this.iditemedit === key.idItercepcion) {
            this.njinteranota = key.numanota;
            this.ptsintercepta = "6"; //key.puntos;
            console.log("ptsintercepta: ", this.ptsintercepta);
          }
        }
      });
    }
  }
  /* Eliminar el registro seleccionado */
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
    await this.storageService.remove(this.iditemedit);
    this.router.navigate(['/cronome']);
  }
  /* Listar los registros de intercepción del equipo seleccionado */
  async fncInfoEquipo() {
    this.listIntercepciones = [];
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'AC' && array[2] === 'IT') {
        if (this.equipo === key.equipo) {
          this.listIntercepciones.push(key);
        }
      }
    });
  }

}
