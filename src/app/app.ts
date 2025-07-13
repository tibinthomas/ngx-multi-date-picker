import { Component, signal } from '@angular/core';
import { NgxMultiDatePickerLib } from 'ngx-multi-date-picker-lib';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [NgxMultiDatePickerLib, FormsModule, JsonPipe],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ngx-multi-date-picker');

  selectedDates = ['2023-10-01T00:00:00'];
}
