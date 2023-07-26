import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useInsuranceDocumentEndpoint } from './use-endpoint.hook';

export default component$(() => {
  const client = useInsuranceDocumentEndpoint();

  return (
    <>
      {/* Add Insurance Document Link*/}
      <Link href="/offer/add">Add</Link>
      {/* Filter */}
      <input
        type="text"
        placeholder="Filter documents ..."
        oninput$={(event) =>
          (client.state.filter = (event.target as HTMLInputElement).value)
        }
      />
      {/* Data Table Command Bar */}
      <hr />
      {client.state.current?.kannAngenommenWerden && (
        <button onclick$={() => client.acceptOffer()}>Accept</button>
      )}
      {client.state.current?.kannAusgestelltWerden && (
        <button onclick$={() => client.finalizeDocument()}>Complete</button>
      )}
      <hr />

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            {/*  TODO: try out qwik-speak */}
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
                  <label for={model.id}>{model.dokumenttyp}</label>
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
