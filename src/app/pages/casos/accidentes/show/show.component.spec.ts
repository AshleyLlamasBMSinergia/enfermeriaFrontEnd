import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentesShowComponent } from './show.component';

describe('ShowComponent', () => {
  let component: AccidentesShowComponent;
  let fixture: ComponentFixture<AccidentesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentesShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccidentesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
