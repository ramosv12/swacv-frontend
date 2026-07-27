import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendarizar } from './calendarizar';

describe('Calendarizar', () => {
  let component: Calendarizar;
  let fixture: ComponentFixture<Calendarizar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendarizar],
    }).compileComponents();

    fixture = TestBed.createComponent(Calendarizar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
