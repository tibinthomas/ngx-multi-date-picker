import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMultiDatePickerLib } from './ngx-multi-date-picker-lib';

describe('NgxMultiDatePickerLib', () => {
  let component: NgxMultiDatePickerLib;
  let fixture: ComponentFixture<NgxMultiDatePickerLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMultiDatePickerLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMultiDatePickerLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
