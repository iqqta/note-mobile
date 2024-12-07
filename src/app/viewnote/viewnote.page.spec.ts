import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewnotePage } from './viewnote.page';

describe('ViewnotePage', () => {
  let component: ViewnotePage;
  let fixture: ComponentFixture<ViewnotePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewnotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
