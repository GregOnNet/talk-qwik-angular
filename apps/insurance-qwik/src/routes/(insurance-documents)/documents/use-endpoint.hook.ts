import { $, Signal, useComputed$, useSignal, useTask$ } from '@builder.io/qwik';
import { ReadInsuranceDocumentDto } from './dto/read-insurance-document.dto';

export function useInsuranceDocumentEndpoint({
  endpoint,
  filter,
}: {
  endpoint: string;
  filter: Signal<string>;
}) {
  const entitiesFromEndpoint = useSignal<ReadInsuranceDocumentDto[]>([]);
  const entities = useSignal<ReadInsuranceDocumentDto[]>([]);

  const currentId = useSignal('');

  const current = useComputed$(() => {
    return entities.value.find((entity) => entity.id === '');
  });

  /* Load Entities initially */
  useTask$(async () => {
    entitiesFromEndpoint.value = await readInsuranceDocuments(endpoint);
    entities.value = entitiesFromEndpoint.value;
  });

  /* Reload Entities when filter changes */
  useTask$(async ({ track }) => {
    const filterTerm = track(() => filter.value);
    const entityList = track(() => entitiesFromEndpoint.value);

    if (!filterTerm) {
      entities.value = entityList;
      return;
    }

    entities.value = entityList.filter(
      (document) =>
        document.dokumenttyp
          .toLocaleLowerCase()
          .includes(filterTerm.toLocaleLowerCase()) ||
        document.risiko
          .toLocaleLowerCase()
          .includes(filterTerm.toLocaleLowerCase()) ||
        document.berechnungsart
          .toLocaleLowerCase()
          .includes(filterTerm.toLocaleLowerCase()),
    );
  });

  const setCurrent = $((document: ReadInsuranceDocumentDto) => {
    console.log('HEA');
    currentId.value = document.id;
  });

  const acceptOffer = $(async () => {
    if (!current.value) {
      throw new Error('Expect Document Id to be set but none is present.');
    }

    await fetch(
      `http://localhost:5123/Dokumente/${current.value.id}/annehmen`,
      {
        method: 'post',
      },
    );

    entitiesFromEndpoint.value = await readInsuranceDocuments(endpoint);
  });

  const finalize = $(async () => {
    if (!current.value) {
      throw new Error('Expect Document Id to be set but none is present.');
    }

    await fetch(
      `http://localhost:5123/Dokumente/${current.value.id}/ausstellen`,
      {
        method: 'post',
      },
    );

    entitiesFromEndpoint.value = await readInsuranceDocuments(endpoint);
  });

  return {
    entities,
    current,
    setCurrent,
    acceptOffer,
    finalizeDocument: finalize,
  };
}

export const readInsuranceDocuments = $(async (endpoint: string) => {
  const response = await fetch(endpoint);

  return await response.json();
});
