import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenesEmbarazoComponent } from './examenes-embarazo.component';

describe('ExamenesEmbarazoComponent', () => {
  let component: ExamenesEmbarazoComponent;
  let fixture: ComponentFixture<ExamenesEmbarazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenesEmbarazoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenesEmbarazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
