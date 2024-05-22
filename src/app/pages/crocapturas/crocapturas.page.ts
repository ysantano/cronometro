import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-crocapturas',
  templateUrl: './crocapturas.page.html',
  styleUrls: ['./crocapturas.page.scss'],
})
export class CrocapturasPage implements OnInit {

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
  ngOnInit() {

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
        const key2 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
        const rec2 = {
          'iditem':key2,
          'feho':dt,
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
