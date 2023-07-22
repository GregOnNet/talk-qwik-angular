import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgIf,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  @Input() label = 'Search...';
  @Input() placeholder = 'Search...';

  @Output() updated = new EventEmitter<string>();

  protected searchInputControl = new FormControl<string | null>(null);

  constructor(private readonly destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.propagateSearchInputValueChanges();
  }

  private propagateSearchInputValueChanges() {
    this.searchInputControl.valueChanges
      .pipe(
        filter((value): value is string => typeof value === 'string'),
        distinctUntilChanged(),
        tap((value) => this.updated.emit(value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
