import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cronome',
  templateUrl: './cronome.page.html',
  styleUrls: ['./cronome.page.scss'],
})
export class CronomePage implements OnInit {

  equipo: string = "visitante"
  sVisitante: string = "00";
  sLocal: string = "00";
  down: string = "0";
  tiempo: string = "00:00";
  timeTab: string = "T1";
  iconBottonPlayPause: string = "caret-forward-outline";

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  async fncChangeTeam() {
  }

  fncChangeDown() {
  }

  iniciarCronometro() {
  }

  fncNextDown() {
  }

  fncLastDown() {
  }

  goCroconfig() {
    this.router.navigate(['/croconfig']);
  }

  goTowchdown() {
    this.router.navigate(['/crotowchdown']);
  }

  goCastigos() {
    this.router.navigate(['/crocastigos']);
  }

  goIntercepciones() {
    this.router.navigate(['/crointercepciones']);
  }

  goCaptura() {
    this.router.navigate(['/crocapturas']);
  }

  estadisticasFinales() {
    this.router.navigate(['/estadisticasfinales']);
  }


}
