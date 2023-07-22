import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { environment } from '../../../../environments/environment';
import { getHarness } from '@jscutlery/cypress-harness';
import { MatTableHarness } from '@angular/material/table/testing';
import { DokumenteView } from './dokumente.view';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ENVIRONMENT_CONFIGURATION_TOKEN } from '../../../environment/environment-configuration.token';

/*
 *
 * TODO: This test does not work
 *       The models are loaded but not rendered.
 *       However the same problem appears in Jest Test.
 *       This problem is not related to Material Test Harness.
 *
 */
describe('Dokumente View', () => {
  describe('When "Dokumente" are filtered', () => {
    it.skip('displays the matching "Dokument"', () => {
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

      cy.intercept(`${environment.apiUrl}/${environment.apiRoutes.dokumente}`, [
        versicherungsschein,
        angebot,
      ]);

      cy.mount(DokumenteView, {
        providers: [
          provideNoopAnimations(),
          provideHttpClient(),
          provideRouter([]),
          // provideNgNeatQueryClient(),
          { provide: ENVIRONMENT_CONFIGURATION_TOKEN, useValue: environment },
        ],
      });

      const table = getHarness(MatTableHarness);

      // const appSearchLoader = await loader.getChildLoader('app-search');
      // const searchInput = await appSearchLoader.getHarness(
      //   MatInputHarness.with({ selector: '[data-test=search-input]' })
      // );

      // await searchInput.setValue('Angebot');
    });
  });
});
