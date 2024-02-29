import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CronomePage } from './cronome.page';

describe('CronomePage', () => {
  let component: CronomePage;
  let fixture: ComponentFixture<CronomePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CronomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
