import { component$ } from '@builder.io/qwik';
import { useInsuranceDocuments } from './use-insurance-documents.hook';
import { LinkPrimary } from '../../components/link-primary/link-primary';
import { FilterInput } from '../../components/filter-input/filter-input';
import { Toolbar } from '../../components/toolbar/toolbar';
import { ButtonSecondary } from '../../components/button-secondary/button-secondary';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  const client = useInsuranceDocuments();

  return (
    <>
      <header style="display: grid; gap: 0.5em; grid-template-columns: auto 1fr; align-items: baseline">
        <LinkPrimary href="/offers/add">add</LinkPrimary>
        {/* Filter */}
        <FilterInput
          placeholder="Filter documents..."
          onChange$={(term) => {
            client.state.filter = term;
          }}
        ></FilterInput>
      </header>

      {/* Data Table Command Bar */}
      <Toolbar>
        {client.state.current?.kannAngenommenWerden && (
          <ButtonSecondary onclick$={() => client.acceptOffer()}>
            Accept
          </ButtonSecondary>
        )}
        {client.state.current?.kannAusgestelltWerden && (
          <ButtonSecondary onclick$={() => client.finalizeDocument()}>
            Complete
          </ButtonSecondary>
        )}
      </Toolbar>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Document Type</th>
            <th>Calculation Type</th>
            <th>Additional Protection</th>
            <th>Operates Webshop</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {client.state.entities.map((model) => {
            return (
              <tr key={model.id}>
                <td>
                  <input
                    type="radio"
                    name="model-select"
                    id={model.id}
                    onchange$={() => (client.state.current = model)}
                  />
                </td>
                <td>
                  <label for={model.id}>
                    <Link href={`documents/${model.id}`}>
                      {model.dokumenttyp}
                    </Link>
                  </label>
                </td>
                <td>
                  <label for={model.id}>{model.berechnungsart}</label>
                </td>
                <td>
                  <label for={model.id}>{model.zusatzschutz}</label>
                </td>
                <td>
                  <label for={model.id}>{model.webshopVersichert}</label>
                </td>
                <td>
                  <label for={model.id}>{model.risiko}</label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
});
