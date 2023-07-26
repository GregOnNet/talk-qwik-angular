import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { ReadInsuranceDocumentDto } from '../../dto/read-insurance-document.dto';

export const useInsuranceDocument = routeLoader$(async (requestEvent) => {
  const documentId = requestEvent.params.documentId;

  const response = await fetch(`http://localhost:5123/Dokumente/${documentId}`);

  const document: ReadInsuranceDocumentDto = await response.json();

  return document;
});

export default component$(() => {
  const document = useInsuranceDocument();

  return (
    <>
      <h1>{document.value?.dokumenttyp} | Details</h1>
      <strong>Insurance Sum</strong> {document.value?.versicherungssumme}
    </>
  );
});
