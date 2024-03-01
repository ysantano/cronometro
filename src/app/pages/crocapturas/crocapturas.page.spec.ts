import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrocapturasPage } from './crocapturas.page';

describe('CrocapturasPage', () => {
  let component: CrocapturasPage;
  let fixture: ComponentFixture<CrocapturasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrocapturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
