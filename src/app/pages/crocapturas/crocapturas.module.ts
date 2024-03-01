import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrocapturasPageRoutingModule } from './crocapturas-routing.module';

import { CrocapturasPage } from './crocapturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrocapturasPageRoutingModule
  ],
  declarations: [CrocapturasPage]
})
export class CrocapturasPageModule {}
