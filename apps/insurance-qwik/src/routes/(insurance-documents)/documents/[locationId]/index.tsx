import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { useInsuranceDocument } from './use-insurance-document.hook';
import { ReadInsuranceDocumentDto } from '../../dto/read-insurance-document.dto';

export default component$(() => {
  const location = useLocation();

  const client = useInsuranceDocument();

  const document = useSignal<ReadInsuranceDocumentDto | null>(null);

  useTask$(async () => {
    const documentId = location.params.locationId;
    document.value = await client.readOne(documentId);
  });

  return (
    <>
      <h1>{document.value?.dokumenttyp} | Details</h1>
      <strong>Insurance Sum</strong> {document.value?.versicherungssumme}
    </>
  );
});
