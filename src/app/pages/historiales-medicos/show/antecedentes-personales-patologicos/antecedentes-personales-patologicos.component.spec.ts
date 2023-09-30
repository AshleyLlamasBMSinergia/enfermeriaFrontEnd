import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesPersonalesPatologicosComponent } from './antecedentes-personales-patologicos.component';

describe('AntecedentesPersonalesPatologicosComponent', () => {
  let component: AntecedentesPersonalesPatologicosComponent;
  let fixture: ComponentFixture<AntecedentesPersonalesPatologicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntecedentesPersonalesPatologicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentesPersonalesPatologicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
