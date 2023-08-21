import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendienteModalComponent } from './pendiente-modal.component';

describe('PendienteModalComponent', () => {
  let component: PendienteModalComponent;
  let fixture: ComponentFixture<PendienteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendienteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
