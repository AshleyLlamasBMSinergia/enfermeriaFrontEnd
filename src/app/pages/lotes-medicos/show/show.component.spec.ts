import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesMedicosShowComponent } from './show.component';

describe('LotesMedicosShowComponent', () => {
  let component: LotesMedicosShowComponent;
  let fixture: ComponentFixture<LotesMedicosShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotesMedicosShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotesMedicosShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
