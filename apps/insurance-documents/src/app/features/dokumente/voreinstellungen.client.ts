import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryService } from '@ngneat/query';
import { forkJoin } from 'rxjs';
import { EnvironmentService } from '../../environment/environment.service';

@Injectable({ providedIn: 'root' })
export class VoreinstellungenClient {
  private readonly key = 'voreinstellungen';
  private endpoint = `${this.environment.configuration.apiUrl}/${this.environment.configuration.apiRoutes.voreinstellungen}`;

  constructor(
    private readonly http: HttpClient,

    private readonly querier: QueryService,

    private readonly environment: EnvironmentService
  ) {}

  read() {
    return this.querier.use({
      queryKey: [this.key],
      queryFn: () =>
        forkJoin({
          berechnungsarten: this.http.get<string[]>(`${this.endpoint}/Berechnungsarten`),
          risiken: this.http.get<string[]>(`${this.endpoint}/Risiken`),
          zusatzaufschlaege: this.http.get<string[]>(`${this.endpoint}/ZusatzschutzAufschlaege`)
        })
    });
  }
}
