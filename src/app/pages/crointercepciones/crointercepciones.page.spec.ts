import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrointercepcionesPage } from './crointercepciones.page';

describe('CrointercepcionesPage', () => {
  let component: CrointercepcionesPage;
  let fixture: ComponentFixture<CrointercepcionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrointercepcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
