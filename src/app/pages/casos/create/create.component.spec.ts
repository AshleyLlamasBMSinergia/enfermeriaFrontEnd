import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CasosCreateComponent;
  let fixture: ComponentFixture<CasosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasosCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
