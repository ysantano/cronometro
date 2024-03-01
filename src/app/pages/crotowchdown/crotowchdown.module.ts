import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrotowchdownPageRoutingModule } from './crotowchdown-routing.module';

import { CrotowchdownPage } from './crotowchdown.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrotowchdownPageRoutingModule
  ],
  declarations: [CrotowchdownPage]
})
export class CrotowchdownPageModule {}
