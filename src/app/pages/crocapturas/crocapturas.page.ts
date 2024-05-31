import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
import { Device, DevicePlugin } from '@capacitor/device';

@Component({
  selector: 'app-crocapturas',
  templateUrl: './crocapturas.page.html',
  styleUrls: ['./crocapturas.page.scss'],
})
export class CrocapturasPage implements OnInit {
  idDevice: string | undefined;

  idJuego: any;
  logoEquL: string;
  nomEquL: string;
  logoEquV: string;
  nomEquV: string

  njcaptura: string = "";
  capturaPtos: boolean = false;
  accionGuardar: string = "Guardar";
  listCapturas: any = [];
  equipo: string = "visitante";

  iditemedit: string = "";
  tiempo: string = "";
  medio: string = "";
  down: number = 0;
  idReg: number = 0;
  ptsintercepta: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  /* Cargar información inicial de las anotaciones */
  async ngOnInit() {
    const _idDevice = await Device.getId();
    this.idDevice = _idDevice.identifier;

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
  /* Guardar información nueva o editada de la captura */
  async guardaCaptura() {
    if (this.accionGuardar === "MODIFICAR CAPTURA") {
      var _tiempo;
      var _timeTab;
      var _down;
      const _storage = await this.storageService.list();
      await _storage?.forEach((key:any, value:any, index:any) => {
        if (value === this.iditemedit) {
          //console.log(value, key);
          _tiempo = key.tiempo;
          _timeTab = key.timeTab;
          _down = key.down;
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
          //console.log('idCaptura: ' + key.idCaptura, 'iditemedit: ' + this.iditemedit);
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
        const _timecurrent = this.getCurrentDayTimestamp(dt);
        const _grp = 'AC';
        const _acc = 'TW';
        const key2 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
        //const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'idDevice':this.idDevice,
          'iditem':key2,
          'feho':dt,
          'timecurrent':_timecurrent,
          'grp':_grp,
          'acc':_acc,
          'idjuego':this.idJuego,
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
      const _timecurrent = this.getCurrentDayTimestamp(dt);
      const _grp = 'AC';
      const _acc = 'KP';
      const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
      //const key1 = this.idReg + '|AC|KP|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'idDevice':this.idDevice,
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
        'njcaptura':this.njcaptura,
        'capturaPtos':this.capturaPtos
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;

      if (this.capturaPtos) {
        this.ptsintercepta = 2;
        const dt = new Date();
        const _timecurrent = this.getCurrentDayTimestamp(dt);
        const _grp = 'AC';
        const _acc = 'TW';
        const key2 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
        //const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'idDevice':this.idDevice,
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
          'puntos': parseFloat(this.ptsintercepta.toString()),
          'numanota':this.njcaptura,
          'numlanza':'',
          'idCaptura':key1
        };
        await this.storageService.set(key2, rec2);
        this.idReg++;
      }

    }
    this.njcaptura = "";
    this.capturaPtos = false;
    this.ptsintercepta = 0;
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
  /* Actualziar datos del registro seleccionado para hacer su edición */
  async editarCaptura(_key: any) {
    this.accionGuardar = "MODIFICAR CAPTURA"
    this.iditemedit = _key.iditem;
    this.njcaptura = _key.njcaptura;
    this.capturaPtos = _key.capturaPtos;
  }
  /* Listar las capturas del equipo seleccionado */
  async fncInfoEquipo() {
    this.listCapturas = [];
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'AC' && array[2] === 'KP') {
        if (this.equipo === key.equipo) {
          this.listCapturas.push(key);
        }
      }
    });
  }
  /* Eliminar el registro seleccionado */
  async borraCaptura(_key:any) {
    this.iditemedit = _key.iditem;
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === "AC" && array[2] === "TW") {
        if (key.idCaptura === this.iditemedit) {
          this.storageService.remove(key.iditem);
        }
      }
    });
    await this.storageService.remove(this.iditemedit);
    this.router.navigate(['/cronome']);
  }

}
