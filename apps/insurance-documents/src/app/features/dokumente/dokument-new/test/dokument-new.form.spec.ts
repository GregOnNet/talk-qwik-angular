import { DokumentNewForm } from '../dokument-new.form';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { parallel } from '@angular/cdk/testing';
import { createVoreinstellungen } from './creaete-voreinstellungen.mock';

describe('DokumentNewForm', () => {
  describe('When "Berechnungsarten" are present', () => {
    it('makes "Berechnungsarten" selectable', async () => {
      TestBed.configureTestingModule({
        imports: [DokumentNewForm],
        providers: [provideNoopAnimations()],
      });

      const fixture = TestBed.createComponent(DokumentNewForm);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      fixture.componentInstance.voreinstellungen = createVoreinstellungen();

      const select = await loader.getHarness(
        MatSelectHarness.with({ selector: '[data-test=berechnungsart-select]' })
      );

      await select.open();

      const options = await select.getOptions();

      expect(options.length).toBe(2);
    });
  });

  describe('When no "Berechnungsart" is selected', () => {
    it('displays a validation message', async () => {
      TestBed.configureTestingModule({
        imports: [DokumentNewForm],
        providers: [provideNoopAnimations()],
      });

      const fixture = TestBed.createComponent(DokumentNewForm);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      fixture.componentInstance.voreinstellungen = {
        berechnungsarten: ['Anzahl Mitarbeiter', 'Umsatz'],
        risiken: [],
        zusatzaufschlaege: [],
      };

      const select = await loader.getHarness(
        MatSelectHarness.with({ selector: '[data-test=berechnungsart-select]' })
      );

      await select.open();
      await select.close();

      const error = await loader.getHarness(
        MatErrorHarness.with({
          selector: '[data-test=berechnungsart-select-error]',
        })
      );

      const errorText = await error.getText();

      expect(errorText).toBe('Bitte wählen Sie eine Berechnungsart aus.');
    });
  });
});

describe('When "Zusatzschutzaufschlag" is checked', () => {
  it('makes "Zusatzschutzaufschläge" selectable', async () => {
    TestBed.configureTestingModule({
      imports: [DokumentNewForm],
      providers: [provideNoopAnimations()],
    });

    const fixture = TestBed.createComponent(DokumentNewForm);

    fixture.componentInstance.voreinstellungen = {
      berechnungsarten: ['Anzahl Mitarbeiter', 'Umsatz'],
      risiken: [],
      zusatzaufschlaege: ['10%', '20%'],
    };

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const checkbox = await loader.getHarness(
      MatCheckboxHarness.with({
        selector: '[data-test=will-zusatzschutz-checkbox]',
      })
    );

    await checkbox.check();
    const isChecked = await checkbox.isChecked();

    expect(isChecked).toBe(true);

    // Finding: we put the data-test on the wrong element.
    //          The error says that the MatSelectHarness could not be found
    //          It would be nice if the error says. Found an element but it is no MatSelect.
    const select = await loader.getHarness(
      MatSelectHarness.with({
        selector: '[data-test=zusatzschutzaufschlag-select]',
      })
    );

    await select.open();

    const options = await select.getOptions();

    expect(options.length).toBe(2);
  });
});

describe('[👶🏻 Child Loader] Dokument New Form', () => {
  it('allows having a single test entry from which we access test harnesses', async () => {
    TestBed.configureTestingModule({
      imports: [DokumentNewForm],
      providers: [provideNoopAnimations()],
    });

    const fixture = TestBed.createComponent(DokumentNewForm);

    fixture.componentInstance.voreinstellungen = {
      berechnungsarten: ['Anzahl Mitarbeiter', 'Umsatz'],
      risiken: [],
      zusatzaufschlaege: [],
    };

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const fieldLoader = await loader.getChildLoader(
      '[data-test=berechnungsart-field]'
    );

    const select = await fieldLoader.getHarness(MatSelectHarness);
    await select.open();
    await select.close();

    // It is not possible to arrange the test before.
    // <mat-error> needs to be present in the DOM otherwise the test crashes.
    const error = await fieldLoader.getHarness(MatErrorHarness);
    const errorMessage = await error.getText();

    expect(errorMessage).toBe('Bitte wählen Sie eine Berechnungsart aus.');
  });
});
describe('[🚀 Parallel] When the form gets input', () => {
  it('is filled out in parallel', async () => {
    TestBed.configureTestingModule({
      imports: [DokumentNewForm],
      providers: [provideNoopAnimations()],
    });

    const fixture = TestBed.createComponent(DokumentNewForm);

    fixture.componentInstance.voreinstellungen = {
      berechnungsarten: ['Anzahl Mitarbeiter', 'Umsatz'],
      risiken: ['Gering', 'Mittel'],
      zusatzaufschlaege: [],
    };

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const berechnungSelect = await loader.getHarness(
      MatSelectHarness.with({ selector: '[data-test=berechnungsart-select]' })
    );

    const risikoSelect = await loader.getHarness(
      MatSelectHarness.with({ selector: '[data-test=risiko-select]' })
    );

    const versicherungssummeInput = await loader.getHarness(
      MatInputHarness.with({
        selector: '[data-test=versicherungssumme-input]',
      })
    );

    const hatWebShopCheckbox = await loader.getHarness(
      MatCheckboxHarness.with({ selector: '[data-test=hat-webshop-checkbox]' })
    );

    const willZusatzschutzCheckbox = await loader.getHarness(
      MatCheckboxHarness.with({
        selector: '[data-test=will-zusatzschutz-checkbox]',
      })
    );

    await berechnungSelect.open();
    await berechnungSelect.clickOptions({ text: 'Umsatz' });
    await risikoSelect.open();
    await risikoSelect.clickOptions({ text: 'Gering' });

    await parallel(() => [
      hatWebShopCheckbox.check(),
      willZusatzschutzCheckbox.check(),
      versicherungssummeInput.setValue(`${100_000}`),
    ]);

    // Learning: Interactions with the DOM cannot run in parallel, when selects are involved.
    //           This is because, only one overlay of the select can be open at the same time.
    //
    // await parallel(() => [
    //   berechnungSelect
    //     .open()
    //     .then(() => berechnungSelect.clickOptions({ text: 'Umsatz' })),
    //   risikoSelect
    //     .open()
    //     .then(() => risikoSelect.clickOptions({ text: 'Gering' })),
    //   versicherungssummeInput.setValue(`${100_000}`),
    // ]);

    // Get values in parallel takes between 915ms - 930ms (Macbook Pro 2019)
    const [
      berechnung,
      risiko,
      versicherungssumme,
      hatWebShop,
      willZusatzschutz,
    ] = await parallel(() => [
      berechnungSelect.getValueText(),
      risikoSelect.getValueText(),
      versicherungssummeInput.getValue(),
      hatWebShopCheckbox.isChecked(),
      willZusatzschutzCheckbox.isChecked(),
    ]);

    // Get values sequentially takes between 926ms - 937ms (Macbook Pro 2019)
    // const berechnung = await berechnungSelect.getValueText();
    // const risiko = await risikoSelect.getValueText();
    // const versicherungssumme = await versicherungssummeInput.getValue();

    expect(berechnung).toBe('Umsatz');
    expect(risiko).toBe('Gering');
    expect(versicherungssumme).toBe(`${100_000}`);
    expect(hatWebShop).toBe(true);
    expect(willZusatzschutz).toBe(true);
  });
});
