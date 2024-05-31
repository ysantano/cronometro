import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
import { Device, DevicePlugin } from '@capacitor/device';

@Component({
  selector: 'app-crocastigos',
  templateUrl: './crocastigos.page.html',
  styleUrls: ['./crocastigos.page.scss'],
})
export class CrocastigosPage implements OnInit {
  idDevice: string | undefined;

  idJuego: any;
  logoEquL: string;
  nomEquL: string;
  logoEquV: string;
  nomEquV: string

  njcastigo: string = "";
  idcastigo: number = 1;
  castigos: any = [
    {'id':1, 'castigo':'No definido'},
    {'id':2, 'castigo':'Fuera de juego'},
    {'id':3, 'castigo':'Movimiento ilegal'},
    {'id':4, 'castigo':'Contacto ilegal'},
    {'id':5, 'castigo':'Sujetar'},
    {'id':6, 'castigo':'Interferencia en pase'},
    {'id':7, 'castigo':'Bloqueo ilegal'},
    {'id':8, 'castigo':'Proteger la bandera'},
    {'id':9, 'castigo':'Golpear al pasador'},
    {'id':10, 'castigo':'Conducta antideportiva'},
    {'id':11, 'castigo':'Retraso de juego'},
  ];
  accionGuardar: string = "Guardar";
  equipo: string = "visitante";
  listCastigos: any = [];
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
    /* Actualziar información enviada del formulario anterior. */
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
        this.tiempo = params['tiempo'];
        this.medio = params['medio'];
        this.down = Number(params['down']);
        this.equipo = params['equipo'];
        this.idReg = params['idreg'];
      }
    });
    this.fncInfoEquipo()
  }
  /* Guardar la información nueva o editada del castigo. */
  async guardaCastigo() {
    console.log("Castigo: ", this.accionGuardar + " idCastigo:" + this.idcastigo);
    //this.idcastigo = 0;
    if (this.accionGuardar === "MODIFICAR CASTIGO") {
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
            'njcastigo':this.njcastigo,
            'idcastigo':parseFloat(this.idcastigo.toString())
          };
          this.storageService.set(value, rec1);
        }
      });

    } else {
      const dt = new Date();
      const _timecurrent = this.getCurrentDayTimestamp(dt);
      const _grp = 'AC';
      const _acc = 'CT';
      const key1 = this.idReg + '|' + _grp + '|' + _acc + '|' + this.idJuego + '|' + _timecurrent;
      //const key1 = this.idReg + '|AC|CT|135|' + this.getCurrentDayTimestamp(dt);
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
        'njcastigo':this.njcastigo,
        'idcastigo':parseFloat(this.idcastigo.toString())
      };
      await this.storageService.set(key1, rec1);
      this.idReg++;
    }
    this.njcastigo = "";
    this.idcastigo = 0;
    this.router.navigate(['/cronome']);
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
  /* Lista los catigos cometidos según el equipo seleccinado */
  async fncInfoEquipo() {
    this.listCastigos = [];
    const _storage = await this.storageService.list();
    await _storage?.forEach((key:any, value:any, index:any) => {
      const array = value.split('|');
      if (array[1] === 'AC' && array[2] === 'CT') {
        if (this.equipo === key.equipo) {
          this.listCastigos.push(key);
        }
      }
    });
  }
  /* Modificar la información del castigo seleccionado */
  editarCastigo(_key:any) {
    this.accionGuardar = "MODIFICAR CASTIGO"
    this.iditemedit = _key.iditem;
    this.equipo = _key.equipo;
    this.njcastigo = _key.njcastigo;
    this.idcastigo = _key.idcastigo;
  }
  /* Eliminar el castigo seleccionado */
  async borraCastigo(_key:any) {
    this.iditemedit = _key.iditem;
    await this.storageService.remove(this.iditemedit);
    this.router.navigate(['/cronome']);
  }

}
