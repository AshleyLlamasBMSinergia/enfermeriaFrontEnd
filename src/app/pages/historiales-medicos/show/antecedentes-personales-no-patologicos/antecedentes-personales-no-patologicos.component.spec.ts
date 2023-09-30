import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesPersonalesNoPatologicosComponent } from './antecedentes-personales-no-patologicos.component';

describe('AntecedentesPersonalesNoPatologicosComponent', () => {
  let component: AntecedentesPersonalesNoPatologicosComponent;
  let fixture: ComponentFixture<AntecedentesPersonalesNoPatologicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntecedentesPersonalesNoPatologicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentesPersonalesNoPatologicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
