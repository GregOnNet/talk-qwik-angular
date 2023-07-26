import { component$, PropFunction } from '@builder.io/qwik';
import { ReadInsuranceDocumentDto } from '../../routes/(insurance-documents)/dto/read-insurance-document.dto';
import { Link } from '@builder.io/qwik-city';

export const DataTable = component$(
  (props: {
    entities: ReadInsuranceDocumentDto[];
    onSelect$?: PropFunction<(entity: ReadInsuranceDocumentDto) => void>;
  }) => {
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Document Type</th>
            <th>Calculation Type</th>
            <th>Additional Protection</th>
            <th>Operates Webshop</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {props.entities.map((entity) => {
            return (
              <tr key={entity.id}>
                <td>
                  <input
                    type="radio"
                    name="model-select"
                    id={entity.id}
                    onchange$={() => props.onSelect$?.(entity)}
                  />
                </td>
                <td>
                  <label for={entity.id}>
                    <Link href={`documents/${entity.id}`}>
                      {entity.dokumenttyp}
                    </Link>
                  </label>
                </td>
                <td>
                  <label for={entity.id}>{entity.berechnungsart}</label>
                </td>
                <td>
                  <label for={entity.id}>{entity.zusatzschutz}</label>
                </td>
                <td>
                  <label for={entity.id}>{entity.webshopVersichert}</label>
                </td>
                <td>
                  <label for={entity.id}>{entity.risiko}</label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  },
);
