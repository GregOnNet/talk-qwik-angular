import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
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
  const insuranceDocuments = useInsuranceDocuments();

  return (
    <>
      <table>
        <thead>
          <tr>
            {/*  TODO: try out qwik-speak */}
            <td></td>
            <td>Document Type</td>
            <td>Calculation Type</td>
            <td>Additional Protection</td>
            <td>Operates Webshop</td>
            <td>Risk</td>
          </tr>
        </thead>
        <tbody>
          {insuranceDocuments.value.map((model) => {
            return (
              <tr key={model.id}>
                <td>
                  <input type="radio" name="model-select" id={model.id} />
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
