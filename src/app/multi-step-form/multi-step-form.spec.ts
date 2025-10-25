import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiStepForm } from './multi-step-form';

describe('MultiStepForm', () => {
  let component: MultiStepForm;
  let fixture: ComponentFixture<MultiStepForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiStepForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiStepForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
