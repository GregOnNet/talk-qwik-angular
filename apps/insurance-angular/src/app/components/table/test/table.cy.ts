import { getHarness } from '@jscutlery/cypress-harness';
import { MatTableHarness } from '@angular/material/table/testing';
import { TableComponent } from '../table.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TableTestData } from './table-test-data.type';
import { createTableTestData } from './create-table-test-data.mock';

describe('insurance-documents', () => {
  it('renders table rows according to passed data', () => {
    const columnName: keyof TableTestData = 'workshopTitle';
    const data = createTableTestData();

    cy.mount(TableComponent<TableTestData>, {
      componentProperties: {
        columns: [columnName],
        data,
      },
      providers: [provideNoopAnimations()],
    });

    const table = getHarness(MatTableHarness);

    table.getRows().should('have.length', data.length);
  });
});
