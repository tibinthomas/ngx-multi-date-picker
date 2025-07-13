import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  NzDatePickerComponent,
  NzDatePickerModule,
} from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzSelectItemInterface,
  NzSelectModule,
  NzSelectTopControlComponent,
} from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';

const toLocalISOString = (date: Date): string => {
  const pad = (n: number): string => n.toString().padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  );
};
@Component({
  selector: 'ngx-multi-date-picker',
  imports: [
    FormsModule,
    NzSelectModule,
    NzTagModule,
    NzDatePickerModule,
    NzSelectTopControlComponent,
    NzIconModule,
  ],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMultiDatePickerLib),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngx-multi-date-picker-lib.html',
  styleUrl: './ngx-multi-date-picker-lib.less',
})
export class NgxMultiDatePickerLib implements ControlValueAccessor {
  datePickerRef = viewChild.required<NzDatePickerComponent>(
    NzDatePickerComponent
  );

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  datePipe = inject(DatePipe);

  disableFutureDates = input(true);

  @HostListener('document:keydown', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isCalOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const isClickedInsidePopup = document
      .getElementsByTagName('date-range-popup')
      ?.item(0)
      ?.contains(event.target as HTMLElement);
    const isClickedInside = this.elementRef.nativeElement.contains(
      event.target as HTMLElement
    );

    if (!isClickedInside && !isClickedInsidePopup) {
      this.isCalOpen.set(false);
    }
  }

  isCalOpen = signal(false);
  placeHolder = signal('Select Date');
  selectedDates = signal<string[]>([]);
  displayDate = signal<Date | null>(null);

  formattedSelectedDate = computed(() => {
    return this.selectedDates().map((date) => {
      return {
        nzLabel: this.datePipe.transform(date, 'MM/dd/yyyy') ?? '',
        nzValue: date,
      };
    });
  });

  isClearButtonVisible = computed(() => this.selectedDates()?.length);

  isDisabled = signal(false);

  registerOnChangeFn: any;
  registerOnTouchedFn: any;

  writeValue(obj: any): void {
    this.selectedDates.set(obj ?? []);
  }

  registerOnChange(fn: any): void {
    this.registerOnChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.registerOnTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  openDatePicker() {
    this.isCalOpen.set(true);
    this.registerOnTouchedFn();
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDates().some((selectedDate) => {
      return selectedDate?.includes(toLocalISOString(date).split('T')[0]);
    });
  }

  private isInternalUpdate = false;

  onSelectDate(date: Date): void {
    if (!date) return;
    if (this.isInternalUpdate) return;

    this.isInternalUpdate = true;

    if (this.datePickerRef()) {
      this.datePickerRef().datePickerService.value = undefined as any;
      this.datePickerRef().datePickerService.emitValue$.next();
    }

    this.selectedDates.update((dates) => {
      const formattedDate = toLocalISOString(date).split('T')[0];
      const index = dates.findIndex((selectedDate) =>
        selectedDate.includes(formattedDate)
      );

      if (index > -1) {
        dates.splice(index, 1);
      } else {
        dates.push(formattedDate);
      }
      return [...dates];
    });

    this.registerOnChangeFn(this.selectedDates());

    this.isInternalUpdate = false;
  }

  onClearingDates(value: NzSelectItemInterface) {
    this.selectedDates.update((dates) => {
      const index = dates.findIndex((d) => d === value.nzValue);
      if (index > -1) {
        dates.splice(index, 1);
      }
      return [...dates];
    });
    this.registerOnChangeFn(this.selectedDates());
  }

  disableFutureDatesFn = (current: Date): boolean => {
    if (!this.disableFutureDates()) return false;
    if (!current) return false;

    const now = new Date();
    const nowInEST = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/New_York' })
    );

    const estDate = new Date(
      nowInEST.getFullYear(),
      nowInEST.getMonth(),
      nowInEST.getDate()
    );
    const currentDate = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate()
    );

    return currentDate > estDate;
  };

  handleClear(): void {
    this.selectedDates.set([]);
    this.registerOnChangeFn(this.selectedDates());
  }
}
