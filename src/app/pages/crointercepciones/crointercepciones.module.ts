import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrointercepcionesPageRoutingModule } from './crointercepciones-routing.module';

import { CrointercepcionesPage } from './crointercepciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrointercepcionesPageRoutingModule
  ],
  declarations: [CrointercepcionesPage]
})
export class CrointercepcionesPageModule {}
