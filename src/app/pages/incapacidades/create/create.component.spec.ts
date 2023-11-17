import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesCreateComponent } from './create.component';

describe('IncapacidadesCreateComponent', () => {
  let component: IncapacidadesCreateComponent;
  let fixture: ComponentFixture<IncapacidadesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.IncapacidadesCreateComponent(IncapacidadesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
