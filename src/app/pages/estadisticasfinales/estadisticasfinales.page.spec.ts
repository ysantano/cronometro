import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadisticasfinalesPage } from './estadisticasfinales.page';

describe('EstadisticasfinalesPage', () => {
  let component: EstadisticasfinalesPage;
  let fixture: ComponentFixture<EstadisticasfinalesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EstadisticasfinalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
