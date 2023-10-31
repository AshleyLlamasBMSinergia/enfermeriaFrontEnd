import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: InsumoCreateComponent;
  let fixture: ComponentFixture<InsumoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumoCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
