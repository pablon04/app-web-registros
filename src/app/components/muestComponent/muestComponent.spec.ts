import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  MuestComponent } from './muestComponent';

describe(' MuestComponent', () => {
  let component:  MuestComponent;
  let fixture: ComponentFixture< MuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent( MuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
