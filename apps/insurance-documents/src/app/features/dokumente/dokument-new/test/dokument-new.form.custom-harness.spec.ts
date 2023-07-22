import { TestBed } from '@angular/core/testing';
import { DokumentNewForm } from '../dokument-new.form';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DokumentNewFormHarness } from './dokument-new-form.harness';
import { render } from '@testing-library/angular';
import { createVoreinstellungen } from './creaete-voreinstellungen.mock';

describe('Dokument New Form', () => {
  describe('[🖌️ Custom Harness]', () => {
    it('fills the form', async () => {
      TestBed.configureTestingModule({
        imports: [DokumentNewForm],
        providers: [provideNoopAnimations()],
      });

      const fixture = TestBed.createComponent(DokumentNewForm);

      fixture.componentInstance.voreinstellungen = createVoreinstellungen();

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const sut = await loader.getHarness(DokumentNewFormHarness);

      const formValues = await sut.fillForm({
        berechnungOptionText: 'Umsatz',
        risikoOptionText: 'Gering',
        versicherungssumme: 100_000,
        hatWebShop: true,
        willZusatzschutz: true,
      });

      expect(formValues).toEqual({
        berechnung: 'Umsatz',
        risiko: 'Gering',
        versicherungssumme: 100_000,
        hatWebShop: true,
        willZusatzschutz: true,
      });
    });
  });

  describe('[🦑 Testing Library]', () => {
    it('fills the form', async () => {
      const view = await render(DokumentNewForm, {
        componentInputs: { voreinstellungen: createVoreinstellungen() },
        providers: [provideNoopAnimations()],
      });

      const loader = TestbedHarnessEnvironment.loader(view.fixture);

      const sut = await loader.getHarness(DokumentNewFormHarness);

      const formValues = await sut.fillForm({
        berechnungOptionText: 'Umsatz',
        risikoOptionText: 'Gering',
        versicherungssumme: 100_000,
        hatWebShop: true,
        willZusatzschutz: true,
      });

      expect(formValues).toEqual({
        berechnung: 'Umsatz',
        risiko: 'Gering',
        versicherungssumme: 100_000,
        hatWebShop: true,
        willZusatzschutz: true,
      });
    });
  });
});
