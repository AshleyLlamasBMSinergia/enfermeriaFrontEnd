import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependientesComponent } from './dependientes.component';

describe('DependientesComponent', () => {
  let component: DependientesComponent;
  let fixture: ComponentFixture<DependientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DependientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DependientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
