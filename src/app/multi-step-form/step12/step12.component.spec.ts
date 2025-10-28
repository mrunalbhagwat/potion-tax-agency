import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step12Component } from './step12.component';

describe('Step12Component', () => {
  let component: Step12Component;
  let fixture: ComponentFixture<Step12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step12Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
