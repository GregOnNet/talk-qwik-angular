import { $, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ReadInsuranceDocumentDto } from './dto/read-insurance-document.dto';

interface EntityState<TEntity> {
  entities: TEntity[];
  current: TEntity | null;
  filter: string;
}

export function useInsuranceDocumentEndpoint() {
  const entitiesFromEndpoint = useSignal<ReadInsuranceDocumentDto[]>([]);

  const state = useStore<EntityState<ReadInsuranceDocumentDto>>({
    entities: [],
    current: null,
    filter: '',
  });

  /* Load Entities initially */
  useTask$(async () => {
    entitiesFromEndpoint.value = await readInsuranceDocuments();
    state.entities = entitiesFromEndpoint.value;
  });

  /* Reload Entities when filter-input changes */
  useTask$(async ({ track }) => {
    const filterTerm = track(() => state.filter);
    const entityList = track(() => entitiesFromEndpoint.value);

    if (!filterTerm) {
      state.entities = entityList;
      return;
    }

    state.entities = entityList.filter(
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

  /* Update current if eneties have changed */
  useTask$(({ track }) => {
    const entities = track(() => state.entities);

    if (!state.current) {
      return;
    }

    state.current =
      entities.find((entity) => entity.id === state.current?.id) ?? null;
  });

  const acceptOffer = $(async () => {
    if (!state.current) {
      throw new Error('Expect Document Id to be set but none is present.');
    }

    await fetch(
      `http://localhost:5123/Dokumente/${state.current.id}/annehmen`,
      {
        method: 'post',
      },
    );

    entitiesFromEndpoint.value = await readInsuranceDocuments();
  });

  const finalizeDocument = $(async () => {
    if (!state.current) {
      throw new Error('Expect Document Id to be set but none is present.');
    }

    await fetch(
      `http://localhost:5123/Dokumente/${state.current.id}/ausstellen`,
      {
        method: 'post',
      },
    );

    entitiesFromEndpoint.value = await readInsuranceDocuments();
  });

  return {
    state,
    acceptOffer,
    finalizeDocument,
  };
}

export const readInsuranceDocuments = $(async () => {
  const response = await fetch('http://localhost:5123/Dokumente');

  return await response.json();
});
