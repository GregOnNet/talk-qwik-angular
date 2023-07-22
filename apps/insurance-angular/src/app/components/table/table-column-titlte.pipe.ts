import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'tableColumnTitle'
})
export class TableColumnTitlePipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';

    const splitByCapitals = value.replace(/(?<!^)([A-Z])/g, ' $1');

    const capitalized = splitByCapitals.charAt(0).toUpperCase() + splitByCapitals.slice(1);

    return capitalized;
  }
}
