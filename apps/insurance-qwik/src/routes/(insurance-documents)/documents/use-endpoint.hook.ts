import { $, Signal, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ReadInsuranceDocumentDto } from './dto/read-insurance-document.dto';

export function useInsuranceDocumentEndpoint({
  endpoint,
  filter,
}: {
  endpoint: string;
  filter: Signal<string>;
}) {
  const entitiesFromEndpoint = useSignal<ReadInsuranceDocumentDto[]>([]);
  const store = useStore<{ entities: ReadInsuranceDocumentDto[] }>({
    entities: [],
  });

  /* Load Entities initially */
  useTask$(async () => {
    entitiesFromEndpoint.value = await readInsuranceDocuments(endpoint);
    store.entities = entitiesFromEndpoint.value;
  });

  /* Reload Entities when filter changes */
  useTask$(async ({ track }) => {
    const filterTerm = track(() => filter.value);

    if (!filterTerm) {
      store.entities = entitiesFromEndpoint.value;
      return;
    }

    store.entities = entitiesFromEndpoint.value.filter(
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

  return { entities: store.entities };
}

export const readInsuranceDocuments = $(async (endpoint: string) => {
  const response = await fetch(endpoint);

  return await response.json();
});
