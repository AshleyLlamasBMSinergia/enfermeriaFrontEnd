import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenesAntidopingComponent } from './examenes-antidoping.component';

describe('ExamenesAntidopingComponent', () => {
  let component: ExamenesAntidopingComponent;
  let fixture: ComponentFixture<ExamenesAntidopingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenesAntidopingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenesAntidopingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
