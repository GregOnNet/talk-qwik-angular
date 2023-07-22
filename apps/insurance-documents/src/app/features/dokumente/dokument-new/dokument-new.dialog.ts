import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DokumenteClient } from '../dokumente.client';
import { ErzeugeNeuesAngebotDto } from '../models';
import { DokumentNewForm } from './dokument-new.form';
import { toSignal } from '@angular/core/rxjs-interop';
import { VoreinstellungenClient } from '../voreinstellungen.client';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dokument-new-dialog',
  standalone: true,
  imports: [NgIf, DialogComponent, MatButtonModule, DokumentNewForm],
  templateUrl: 'dokument-new.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DokumentNewDialog {
  protected readonly voreinstellungenResult = toSignal(this.voreinstellungenClient.read().result$);

  protected angebotDto: ErzeugeNeuesAngebotDto | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,

    private readonly voreinstellungenClient: VoreinstellungenClient,
    private readonly dokumenteClient: DokumenteClient
  ) {}

  protected async close() {
    await this.router.navigate(['..'], { relativeTo: this.route });
  }

  protected updateAngebotDto(dto: ErzeugeNeuesAngebotDto | null) {
    this.angebotDto = dto;
  }

  protected async createAngebot() {
    if (!this.angebotDto) {
      return;
    }

    await this.dokumenteClient
      .create()
      .mutate(this.angebotDto)
      .then(() => this.close());
  }
}
