import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumComponent } from './humComponent';

describe('Register', () => {
  let component: HumComponent;
  let fixture: ComponentFixture<HumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
