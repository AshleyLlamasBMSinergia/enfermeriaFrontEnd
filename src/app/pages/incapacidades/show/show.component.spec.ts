import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesShowComponent } from './show.component';

describe('IncapacidadesShowComponent', () => {
  let component: IncapacidadesShowComponent;
  let fixture: ComponentFixture<IncapacidadesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
