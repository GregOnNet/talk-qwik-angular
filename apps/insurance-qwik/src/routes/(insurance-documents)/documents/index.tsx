import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { ReadInsuranceDocumentDto } from './dto/read-insurance-document.dto';
import { useInsuranceDocumentEndpoint } from './use-endpoint.hook';

export default component$(() => {
  const insuranceDocuments = useSignal<ReadInsuranceDocumentDto[]>([]);

  const modelFilter = useSignal('');
  const modelSelected = useSignal<ReadInsuranceDocumentDto | null>(null);

  const client = useInsuranceDocumentEndpoint({
    endpoint: 'http://localhost:5123/Dokumente',
    filter: modelFilter,
  });

  // Update modelSelected when collection has changed or has been reloaded
  useTask$(({ track }) => {
    const documentSelected = track(() => modelSelected.value);
    const documents = track(() => insuranceDocuments.value);

    if (!documentSelected) return;

    modelSelected.value =
      documents.find((document) => document.id === documentSelected.id) ?? null;
  });

  return (
    <>
      {/* Add Insurance Document Link*/}
      <Link href="/offer/add">Add</Link>
      {/* Filter */}
      <input
        type="text"
        placeholder="Filter documents ..."
        oninput$={(event) =>
          (modelFilter.value = (event.target as HTMLInputElement).value)
        }
      />
      {/* Data Table Command Bar */}
      <hr />
      {JSON.stringify(client.current.value)}
      {client.current.value?.kannAngenommenWerden && (
        <button onclick$={() => client.acceptOffer()}>Accept</button>
      )}
      {client.current.value?.kannAusgestelltWerden && (
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
          {client.entities.value.map((model) => {
            return (
              <tr key={model.id}>
                <td>
                  <input
                    type="radio"
                    name="model-select"
                    id={model.id}
                    onchange$={() => client.setCurrent(model)}
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
