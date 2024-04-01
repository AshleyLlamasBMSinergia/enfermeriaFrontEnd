import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadComponent } from './incapacidad.component';

describe('IncapacidadComponent', () => {
  let component: IncapacidadComponent;
  let fixture: ComponentFixture<IncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
