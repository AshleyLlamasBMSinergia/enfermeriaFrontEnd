import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosIndexComponent } from './index.component';

describe('CasosIndexComponent', () => {
  let component: CasosIndexComponent;
  let fixture: ComponentFixture<CasosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasosIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
