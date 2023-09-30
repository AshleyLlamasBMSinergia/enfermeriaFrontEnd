import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenesVistaComponent } from './examenes-vista.component';

describe('ExamenesVistaComponent', () => {
  let component: ExamenesVistaComponent;
  let fixture: ComponentFixture<ExamenesVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenesVistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenesVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
