# ngx-multi-date-picker-lib

A modern Angular component for selecting multiple dates, designed for seamless integration with Angular forms and built using NG-ZORRO UI components. Features include multi-date selection, tag display, disabling future dates (EST-aware), and full form compatibility.

## Author

Tibin Thomas

## Features

- Select and manage multiple dates from a calendar popup
- Display selected dates as removable tags
- Optionally disable selection of future dates (EST timezone)
- Integrates with Angular Reactive and Template-driven Forms
- Built with [NG-ZORRO](https://ng.ant.design/) for a consistent UI
- Keyboard navigation and click-outside handling for accessibility

## Installation

```bash
npm install ngx-multi-date-picker-lib ng-zorro-antd
```

> **Note:** Requires Angular 16+ and NG-ZORRO 17+ as peer dependencies.

## Usage

### 1. Import the module

```typescript
import { NgxMultiDatePickerLib } from 'ngx-multi-date-picker-lib';

@NgModule({
  imports: [NgxMultiDatePickerLib, ...],
})
export class AppModule {}
```

### 2. Add the component to your template

```html
<ngx-multi-date-picker [(ngModel)]="selectedDates" placeholder="Select Dates"></ngx-multi-date-picker>
```

- `[(ngModel)]` or `formControlName` binds the selected dates array (ISO date strings)
- `placeholder` sets the input placeholder text

## API

| Input         | Type     | Default       | Description                    |
| ------------- | -------- | ------------- | ------------------------------ |
| `placeholder` | `string` | 'Select Date' | Placeholder text for the input |

## Events

- Standard Angular form events are supported via `ControlValueAccessor`.

## Example

```typescript
selectedDates: string[] = [];
```

## Development

- **Build the library:**
  ```bash
  ng build ngx-multi-date-picker-lib
  ```
- **Run unit tests:**
  ```bash
  ng test ngx-multi-date-picker-lib
  ```

## Publishing

After building, publish from the `dist/ngx-multi-date-picker-lib` directory:

```bash
cd dist/ngx-multi-date-picker-lib
npm publish
```

## License

MIT
