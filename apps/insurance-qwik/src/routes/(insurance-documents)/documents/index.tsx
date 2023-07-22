import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, routeLoader$ } from '@builder.io/qwik-city';
import { ReadInsuranceDocumentDto } from './dto/read-insurance-document.dto';

export const useInsuranceDocuments = routeLoader$(async () => {
  // TODO: Move endpoint url to environment
  const endpoint = 'http://localhost:5123/Dokumente';

  const response = await fetch(endpoint);

  // TODO: reason about validate response against zod-schema.
  const documents: ReadInsuranceDocumentDto[] = await response.json();

  return documents;
});

export default component$(() => {
  const insuranceDocuments = useSignal<ReadInsuranceDocumentDto[]>([]);

  const models = useSignal<ReadInsuranceDocumentDto[]>([]);
  const modelFilter = useSignal('');
  const modelSelected = useSignal<ReadInsuranceDocumentDto | null>(null);

  const readInsuranceDocuments = $(async () => {
    const response = await fetch('http://localhost:5123/Dokumente');

    return await response.json();
  });

  // Initially load insurance documents
  useTask$(async () => {
    insuranceDocuments.value = await readInsuranceDocuments();
  });

  // Filter insurance documents by type, risk, calculation type
  useTask$(({ track }) => {
    const modelFilterValue = track(() => modelFilter.value);
    const documents = track(() => insuranceDocuments.value);

    if (!modelFilterValue) {
      models.value = documents;
      return;
    }

    models.value = documents.filter(
      (document) =>
        document.dokumenttyp
          .toLocaleLowerCase()
          .includes(modelFilterValue.toLocaleLowerCase()) ||
        document.risiko
          .toLocaleLowerCase()
          .includes(modelFilterValue.toLocaleLowerCase()) ||
        document.berechnungsart
          .toLocaleLowerCase()
          .includes(modelFilterValue.toLocaleLowerCase()),
    );
  });

  // Update modelSelected when collection has changed or has been reloaded
  useTask$(({ track }) => {
    const documentSelected = track(() => modelSelected.value);
    const documents = track(() => insuranceDocuments.value);

    if (!documentSelected) return;

    modelSelected.value =
      documents.find((document) => document.id === documentSelected.id) ?? null;
  });

  const acceptOffer = $(async () => {
    const documentId = modelSelected.value?.id;

    if (!documentId) {
      throw new Error('Expect Document Id to be set but none is present.');
    }

    // TODO: Reason about better way managing state
    await fetch(`http://localhost:5123/Dokumente/${documentId}/annehmen`, {
      method: 'post',
    });

    insuranceDocuments.value = await readInsuranceDocuments();
  });

  const finalizeInsuranceDocument = $(async () => {
    const documentId = modelSelected.value?.id;

    if (!documentId) {
      throw new Error('Expect Document Id to be set but none is present.');
    }

    // TODO: Reason about better way managing state
    await fetch(`http://localhost:5123/Dokumente/${documentId}/ausstellen`, {
      method: 'post',
    });

    insuranceDocuments.value = await readInsuranceDocuments();
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
      {modelSelected.value?.kannAngenommenWerden && (
        <button onclick$={() => acceptOffer()}>Accept</button>
      )}
      {modelSelected.value?.kannAusgestelltWerden && (
        <button onclick$={() => finalizeInsuranceDocument()}>Complete</button>
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
          {models.value.map((model) => {
            return (
              <tr key={model.id}>
                <td>
                  <input
                    type="radio"
                    name="model-select"
                    id={model.id}
                    onchange$={() => (modelSelected.value = model)}
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