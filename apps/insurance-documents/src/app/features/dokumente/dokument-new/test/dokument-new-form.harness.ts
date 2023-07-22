import { ComponentHarness, parallel } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

export class DokumentNewFormHarness extends ComponentHarness {
  static hostSelector = '[data-test=dokument-new-form-host]';

  protected readonly berechnungSelect = this.locatorFor(
    MatSelectHarness.with({ selector: '[data-test=berechnungsart-select]' })
  );
  protected readonly risikoSelect = this.locatorFor(
    MatSelectHarness.with({ selector: '[data-test=risiko-select]' })
  );
  protected readonly versicherungssummeInput = this.locatorFor(
    MatInputHarness.with({
      selector: '[data-test=versicherungssumme-input]',
    })
  );

  protected readonly hatWebShopCheckbox = this.locatorFor(
    MatCheckboxHarness.with({ selector: '[data-test=hat-webshop-checkbox]' })
  );

  protected readonly willZusatzschutzCheckbox = this.locatorFor(
    MatCheckboxHarness.with({
      selector: '[data-test=will-zusatzschutz-checkbox]',
    })
  );

  async fillForm(values: {
    berechnungOptionText: string;
    risikoOptionText: string;
    versicherungssumme: number;
    hatWebShop: boolean;
    willZusatzschutz: boolean;
  }): Promise<{
    berechnung: string;
    risiko: string;
    versicherungssumme: number;
    hatWebShop: boolean;
    willZusatzschutz: boolean;
  }> {
    await this.berechnungSelect().then((harness) => harness.open());
    await this.berechnungSelect().then((harness) =>
      harness.clickOptions({ text: 'Umsatz' })
    );
    await this.risikoSelect().then((harness) => harness.open());
    await this.risikoSelect().then((harness) =>
      harness.clickOptions({ text: 'Gering' })
    );

    await parallel(() => [
      this.hatWebShopCheckbox().then((harness) => harness.check()),
      this.willZusatzschutzCheckbox().then((harness) => harness.check()),
      this.versicherungssummeInput().then((harness) =>
        harness.setValue(`${100_000}`)
      ),
    ]);

    const [
      berechnung,
      risiko,
      versicherungssumme,
      hatWebShop,
      willZusatzschutz,
    ] = await parallel(() => [
      this.berechnungSelect().then((harness) => harness.getValueText()),
      this.risikoSelect().then((harness) => harness.getValueText()),
      this.versicherungssummeInput().then((harness) => harness.getValue()),
      this.hatWebShopCheckbox().then((harness) => harness.isChecked()),
      this.willZusatzschutzCheckbox().then((harness) => harness.isChecked()),
    ]);

    return {
      berechnung,
      risiko,
      versicherungssumme: +versicherungssumme,
      hatWebShop,
      willZusatzschutz,
    };
  }
}
