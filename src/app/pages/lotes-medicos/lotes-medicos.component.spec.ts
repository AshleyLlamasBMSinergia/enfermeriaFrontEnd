import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesMedicosComponent } from './lotes-medicos.component';

describe('LotesMedicosComponent', () => {
  let component: LotesMedicosComponent;
  let fixture: ComponentFixture<LotesMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotesMedicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotesMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
