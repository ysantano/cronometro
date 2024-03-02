import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-crotowchdown',
  templateUrl: './crotowchdown.page.html',
  styleUrls: ['./crotowchdown.page.scss'],
})
export class CrotowchdownPage implements OnInit {

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
            'down':key.down,
            'equipo':this.equipo,
            'puntos': parseFloat(this.puntos.toString()),
            'numanota':this.numanota,
            'numlanza':this.numlanza,
            'idItercepcion':''
          };
          //this.storageService.set(value, rec1);
        }
      });
    } else {
      const dt = new Date();
      const key1 = this.idReg + '|AC|TW|135|' + this.getCurrentDayTimestamp(dt);
      const rec1 = {
        'iditem':key1,
        'feho':dt,
        'tiempo':this.tiempo,
        'medio':this.medio,
        'down':this.down,
        'equipo':this.equipo,
        'puntos': parseFloat(this.puntos.toString()),
        'numanota':this.numanota,
        'numlanza':this.numlanza,
        'idItercepcion':''
      };
      console.log(rec1);
      await this.storageService.set(key1, rec1);
    }

    this.numanota = "";
    this.numlanza = "";
    this.router.navigate(['/cronome']);
  }

  getCurrentDayTimestamp(dt:any) {
    return dt.getFullYear() + ''
    + (dt.getMonth() + 1).toString().padStart(2, '0') + ''
    + dt.getDate().toString().padStart(2, '0') + ''
    + dt.getHours().toString().padStart(2, '0') + ''
    + dt.getMinutes().toString().padStart(2, '0') + ''
    + dt.getSeconds().toString().padStart(2, '0');
  }

  editarAnotacion(item:any) {
  }

  borraAnotacion(item:any) {
  }

  fncInfoEquipo() {
  }

}
