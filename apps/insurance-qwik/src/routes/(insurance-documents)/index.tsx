import { component$ } from '@builder.io/qwik';
import { useInsuranceDocuments } from './use-insurance-documents.hook';
import { LinkPrimary } from '../../components/link-primary/link-primary';
import { FilterInput } from '../../components/filter-input/filter-input';
import { Toolbar } from '../../components/toolbar/toolbar';
import { ButtonSecondary } from '../../components/button-secondary/button-secondary';
import { DataTable } from '../../components/data-table/data-table';

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

      <DataTable
        entities={client.state.entities}
        onSelect$={(entity) => {
          client.state.current = entity;
        }}
      />
    </>
  );
});
