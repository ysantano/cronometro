import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-estadisticasfinales',
  templateUrl: './estadisticasfinales.page.html',
  styleUrls: ['./estadisticasfinales.page.scss'],
})
export class EstadisticasfinalesPage implements OnInit {
  private _storage: any | null = null;
  private _storage2: Map<any, any>;
  dataFinal: any = [];
  equipo: string = "visitante"

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.equipo = params['equipo'];
      }
    });
    this.dateResumen();
  }

  fncChangeTeam() {
    this.dateResumen();
  }

  async dateResumen() {
    this._storage = await this.storageService.list();
    this._storage2 = new Map();
    await this._storage?.forEach((value: any, key: any) => {
      var _key = key.split('|');
      if (_key[1] === "AC") {
        //console.log(_key[1]);
        value['keyid'] = key;
        value['keyord'] = Number(_key[0]);
        value['keygrp'] = _key[1];
        value['keyact'] = _key[2];
        value['keygam'] = _key[3];
        value['keydat'] = _key[4];
        const keyi = _key[0];
        this._storage2.set(keyi, value);
      }
    });

    const sortedEntries = [...(this._storage2?.entries() || [])].sort(([keyA], [keyB]) => {
      if (Number(keyA) < Number(keyB)) return -1;
      if (Number(keyA) > Number(keyB)) return 1;
      return 0;
    });

    var datos:any = [];
    sortedEntries.forEach(([key, value]) => {
      datos.push(value);
    });

    const dataObj: { [key: string]: any } = {};
    await datos?.forEach((key:any, value:any) => {
      //console.log(value, key);
      var _pt = 0;
      var _TW = 0;
      var _lz = 0;
      var _KP = 0;
      var _IT = 0;
      var _CT = 0;

      var key1 = key['equipo'].substring(0,1);
      var key2 = "";
      if (key['keyact'] === "TW") {
        key1 += key['numanota'];
        key2 = key['equipo'].substring(0,1) + key['numlanza'];
        _pt =  key['puntos'];
        _TW = 1;
        _lz = 1;
      }
      if (key['keyact'] === "IT") {
        key1 += key['njintercepta'];
        _IT = 1;
      }
      if (key['keyact'] === "KP") {
        key1 += key['njcaptura'];
        _KP = 1;

      }
      if (key['keyact'] === "CT") {
        key1 += key['njcastigo'];
        _CT = 1;
      }

      //console.log('key1: ', key1);
      if (dataObj[key1] === undefined) {
        dataObj[key1] = {
          'pt':_pt,
          'TW':_TW,
          'lz':0,
          'KP':_KP,
          'IT':_IT,
          'CT':_CT,
          'sm':(_pt + _TW + _KP + _IT)- _CT
        };
      }else{
        var obj = dataObj[key1];
        obj['pt'] += _pt;
        obj['TW'] += _TW;
        obj['lz'] += 0;
        obj['KP'] += _KP;
        obj['IT'] += _IT;
        obj['CT'] += _CT;
        obj['sm'] = (obj['pt'] + obj['TW'] + obj['lz'] + obj['KP'] + obj['IT']) - obj['CT'];
      }

      if (key2 !== '') {
        if (dataObj[key2] === undefined) {
          dataObj[key2] = {
            'pt':0,
            'TW':0,
            'lz':1,
            'KP':0,
            'IT':0,
            'CT':0,
            'sm':1
          };
        }else{
          var obj = dataObj[key2];
          obj['lz'] += _lz;
          obj['sm'] = (obj['pt'] + obj['TW'] + obj['lz'] + obj['KP'] + obj['IT']) - obj['CT'];
        }
      }
    });
    //console.log('final');
    //console.log(dataObj);

    this.dataFinal = [];
    for (const key in dataObj) {
      if (dataObj.hasOwnProperty(key)) {
        var equipo = "local";
        if (key.substring(0,1) === 'v') {
          equipo = "visitante";
        }

        if (equipo === this.equipo) {
          const value = dataObj[key];
          value.idkey = key;
          value.eq = equipo;
          value.NJ = key.substring(1,key.length);
          this.dataFinal.push(value);
        }

      }
    }
    console.log(this.dataFinal);

  }
}
