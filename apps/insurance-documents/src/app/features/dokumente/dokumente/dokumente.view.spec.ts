import { TestBed } from '@angular/core/testing';
import { DokumenteView } from './dokumente.view';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { phl } from '@angular-extensions/pretty-html-log';
import { provideHttpClient } from '@angular/common/http';
import { provideNgNeatQueryClient } from '../../../infrastructure/ngneat';
import { ENVIRONMENT_CONFIGURATION_TOKEN } from '../../../environment/environment-configuration.token';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

/*
 *
 * TODO: This test does not work
 *       The models are loaded but not rendered.
 *       However the same problem appears in Cypress Component Test.
 *       This problem is not related to Material Test Harness.
 *
 */
describe('Dokumente View', () => {
  describe('When "Dokumente" are filtered', () => {
    it.skip('displays the matching "Dokument"', async () => {
      TestBed.configureTestingModule({
        imports: [DokumenteView],
        providers: [
          provideNoopAnimations(),
          provideHttpClient(),
          provideHttpClientTesting(),
          provideNgNeatQueryClient(),
          provideRouter([]),
          { provide: ENVIRONMENT_CONFIGURATION_TOKEN, useValue: environment },
        ],
      });

      const fixture = TestBed.createComponent(DokumenteView);
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const httpController = TestBed.inject(HttpTestingController);

      const versicherungsschein = {
        id: 'd5c70a0b-4a4a-4c17-84d3-43f0f8270930',
        dokumenttyp: 'Versicherungsschein',
        berechnungsart: 'AnzahlMitarbeiter',
        risiko: 'Gering',
        zusatzschutz: '-',
        webshopVersichert: false,
        versicherungssumme: 100000.0,
        beitrag: 20000.0,
        kannAngenommenWerden: false,
        kannAusgestelltWerden: true,
      };
      const angebot = {
        id: '397e996e-9701-48f9-9bf9-0edf92fb0411',
        dokumenttyp: 'Angebot',
        berechnungsart: 'Haushaltssumme',
        risiko: 'Mittel',
        zusatzschutz: '-',
        webshopVersichert: false,
        versicherungssumme: 100000.0,
        beitrag: 126.0,
        kannAngenommenWerden: true,
        kannAusgestelltWerden: false,
      };

      fixture.detectChanges();

      httpController
        .expectOne(`${environment.apiUrl}/${environment.apiRoutes.dokumente}`)
        .flush([versicherungsschein, angebot]);

      // const table = await loader.getHarness(MatTableHarness);

      // const appSearchLoader = await loader.getChildLoader('app-search');
      // const searchInput = await appSearchLoader.getHarness(
      //   MatInputHarness.with({ selector: '[data-test=search-input]' })
      // );

      // await searchInput.setValue('Angebot');

      phl(fixture);
      httpController.verify();
    });
  });
});
