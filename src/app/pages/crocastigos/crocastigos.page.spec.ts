import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrocastigosPage } from './crocastigos.page';

describe('CrocastigosPage', () => {
  let component: CrocastigosPage;
  let fixture: ComponentFixture<CrocastigosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrocastigosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
