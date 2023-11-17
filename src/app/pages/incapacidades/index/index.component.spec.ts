import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesIndexComponent } from './index.component';

describe('IncapacidadesIndexComponent', () => {
  let component: IncapacidadesIndexComponent;
  let fixture: ComponentFixture<IncapacidadesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
