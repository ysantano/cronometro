import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrotowchdownPage } from './crotowchdown.page';

describe('CrotowchdownPage', () => {
  let component: CrotowchdownPage;
  let fixture: ComponentFixture<CrotowchdownPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrotowchdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
