import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cronome',
  templateUrl: './cronome.page.html',
  styleUrls: ['./cronome.page.scss'],
})
export class CronomePage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
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
