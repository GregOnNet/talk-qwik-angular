import { DokumentNewForm } from '../dokument-new.form';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { createVoreinstellungen } from './creaete-voreinstellungen.mock';

describe('DokumentNewForm', () => {
  describe('When "Berechnungsarten" are present', () => {
    it('makes "Berechnungsarten" selectable', async () => {
      TestBed.configureTestingModule({
        imports: [DokumentNewForm],
        providers: [provideNoopAnimations()],
      });

      const fixture = TestBed.createComponent(DokumentNewForm);

      fixture.componentInstance.voreinstellungen = createVoreinstellungen();

      fixture.detectChanges();

      const select: HTMLElement = fixture.debugElement.query(
        By.css('[data-test=berechnungsart-select]')
      ).nativeElement;

      // Clicking the select opens the overlay containing the options
      select.click();
      fixture.detectChanges();

      const selectOptions = fixture.debugElement.queryAll(
        By.css('[data-test=for-vanilla-berechnungsart-select-option]')
      );

      expect(selectOptions.length).toBe(2);
    });
  });

  describe('When no "Berechnungsart" is selected', () => {
    it('displays a validation message', async () => {
      TestBed.configureTestingModule({
        imports: [DokumentNewForm],
        providers: [provideNoopAnimations()],
      });

      const fixture = TestBed.createComponent(DokumentNewForm);

      fixture.componentInstance.voreinstellungen = createVoreinstellungen();

      fixture.detectChanges();

      /*
       *
       * Learning:
       *  - Originally we expected to see the form error message when the select
       *    was opened and closed again
       *  - it turned out it is not that easy to close the select with a second click
       *    or by clicking another element after the select was open.
       *  - after a bit back and forth it turned out that focusing the select and then
       *    focusing another element reveals that error message.
       *  - this is a good example why test harness is a good idea:
       *    - less research how to test something
       *    - more stable test once the select control changes in the future.
       * */
      const berechnungsartSelect: HTMLElement = fixture.debugElement.query(
        By.css('[data-test=berechnungsart-select]')
      ).nativeElement;

      // open select
      berechnungsartSelect.focus();
      fixture.detectChanges();

      // close select - we need to query another element and focus it in order to close
      //                the other select.
      const risikoSelect: HTMLElement = fixture.debugElement.query(
        By.css('[data-test=risiko-select]')
      ).nativeElement;

      risikoSelect.focus();
      fixture.detectChanges();

      const error: HTMLElement = fixture.debugElement.query(
        By.css('[data-test=berechnungsart-select-error]')
      ).nativeElement;
      expect(error.innerHTML).toBe('Bitte wählen Sie eine Berechnungsart aus.');
    });
  });
});
