import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-crocastigos',
  templateUrl: './crocastigos.page.html',
  styleUrls: ['./crocastigos.page.scss'],
})
export class CrocastigosPage implements OnInit {

  njcastigo: string = "";
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
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        console.log(params);
        this.tiempo = params['tiempo'];
        this.medio = params['medio'];
        this.down = params['down'];
        this.equipo = params['equipo'];
        this.idReg = params['idreg'];
      }
    });
    this.fncInfoEquipo()
  }
  /* Guardar la información nueva o editada del castigo. */
  async guardaCastigo() {
    console.log("Castigo: ", this.accionGuardar);
    if (this.accionGuardar === "MODIFICAR CASTIGO") {
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
