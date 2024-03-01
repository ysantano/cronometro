import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CroconfigPage } from './croconfig.page';

describe('CroconfigPage', () => {
  let component: CroconfigPage;
  let fixture: ComponentFixture<CroconfigPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CroconfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
