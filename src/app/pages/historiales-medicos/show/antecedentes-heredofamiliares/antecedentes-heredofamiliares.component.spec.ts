import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesHeredofamiliaresComponent } from './antecedentes-heredofamiliares.component';

describe('AntecedentesHeredofamiliaresComponent', () => {
  let component: AntecedentesHeredofamiliaresComponent;
  let fixture: ComponentFixture<AntecedentesHeredofamiliaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntecedentesHeredofamiliaresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentesHeredofamiliaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
