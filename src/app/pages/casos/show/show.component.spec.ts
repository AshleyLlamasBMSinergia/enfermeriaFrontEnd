import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosShowComponent } from './show.component';

describe('ShowComponent', () => {
  let component: CasosShowComponent;
  let fixture: ComponentFixture<CasosShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasosShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
