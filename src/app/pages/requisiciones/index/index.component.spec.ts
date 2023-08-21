import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicionesIndexComponent } from './index.component';

describe('RequisicionesIndexComponent', () => {
  let component: RequisicionesIndexComponent;
  let fixture: ComponentFixture<RequisicionesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisicionesIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisicionesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
