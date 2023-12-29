import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    console.log('Dentro de page.home');
    this.apiService.getDatos().subscribe((response) => {
      // Manejar la respuesta aquí
      console.log(response);
    });
  }

  fncCronometroJuego() {
    this.router.navigate(['/juego']);
  }
}
