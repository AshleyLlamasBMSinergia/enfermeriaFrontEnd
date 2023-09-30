import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenesFisicosComponent } from './examenes-fisicos.component';

describe('ExamenesFisicosComponent', () => {
  let component: ExamenesFisicosComponent;
  let fixture: ComponentFixture<ExamenesFisicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenesFisicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenesFisicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
