import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-croconfig',
  templateUrl: './croconfig.page.html',
  styleUrls: ['./croconfig.page.scss'],
})
export class CroconfigPage implements OnInit {

  timeTab: string = "T1";
  minutosInputT1: number = 21;
  segundosInputT1: number = 1;
  minutosInputMT: number = 10;
  segundosInputMT: number = 0;
  minutosInputT2: number = 22;
  segundosInputT2: number = 2;


  constructor() { }

  ngOnInit() {
  }

  updateTimeT1() {
  }

  resetCronometroActivo() {
  }

  closeModal() {
  }

}
