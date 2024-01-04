import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestsqlitePage } from './testsqlite.page';

describe('TestsqlitePage', () => {
  let component: TestsqlitePage;
  let fixture: ComponentFixture<TestsqlitePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestsqlitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
