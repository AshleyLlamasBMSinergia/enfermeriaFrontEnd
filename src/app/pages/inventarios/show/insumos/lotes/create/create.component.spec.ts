import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: LotesCreateComponent;
  let fixture: ComponentFixture<LotesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotesCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
