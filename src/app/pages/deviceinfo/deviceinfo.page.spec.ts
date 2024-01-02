import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceinfoPage } from './deviceinfo.page';

describe('DeviceinfoPage', () => {
  let component: DeviceinfoPage;
  let fixture: ComponentFixture<DeviceinfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeviceinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
