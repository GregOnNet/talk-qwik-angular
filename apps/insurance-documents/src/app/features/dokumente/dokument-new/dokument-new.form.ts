import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErzeugeNeuesAngebotDto, VoreinstellungenReadDto } from '../models';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-dokument-new-form',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,

    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './dokument-new.form.html'
})
export class DokumentNewForm {
  protected readonly form = this.setupForm();

  private readonly formValues = toSignal(
    this.form.valueChanges.pipe(
      debounceTime(200),
      map(() => this.form.getRawValue())
    )
  );

  @Input({ required: true }) voreinstellungen: VoreinstellungenReadDto | undefined;
  @Output() changed = new EventEmitter<ErzeugeNeuesAngebotDto|null>();

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    effect(() => this.emitAngebotDtoWhenFormChanged());
  }

  protected toggleDisabled({
    formControlName,
    $event
  }: {
    formControlName: string;
    $event: MatCheckboxChange;
  }) {
    const control = this.form.get(formControlName);

    if (!control) {
      throw new Error(`Expected form to contain control "${formControlName}", but none was found.`);
    }

    $event.checked ? control.enable() : control.disable();
  }

  private setupForm() {
    return this.formBuilder.group({
      berechnungsart: ['', [Validators.required]],
      risiko: ['', [Validators.required]],
      zusatzschutzAufschlag: [{ value: '', disabled: true }, [Validators.required]],
      hatWebshop: false,
      willZusatzschutz: false,
      versicherungssumme: 0,
    });
  }

  private emitAngebotDtoWhenFormChanged() {
    const dto = this.formValues();

    if (this.form.invalid) {
      this.changed.emit(null);

    }

    this.changed.emit(dto);
  }
}
