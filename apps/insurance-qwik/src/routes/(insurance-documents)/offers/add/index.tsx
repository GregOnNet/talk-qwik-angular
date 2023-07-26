import { component$, useSignal } from '@builder.io/qwik';
import { Form, routeAction$, useNavigate, zod$ } from '@builder.io/qwik-city';
import { CreateInsuranceDocumentDtoSchema } from './dto/create-insurance-document.dto';

export const useAddInsuranceDocument = routeAction$(async (data, { error }) => {
  // TODO: Reason about a more comfortable way of sending post requests.
  const response = await fetch('http://localhost:5123/Dokumente', {
    method: 'post',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) return error(400, response.statusText);
}, zod$(CreateInsuranceDocumentDtoSchema));

export default component$(() => {
  const navigate = useNavigate();
  const action = useAddInsuranceDocument();

  const wantsAdditionalProtection = useSignal<boolean>(false);

  return (
    <>
      <h1>Add a new offer</h1>
      <Form
        action={action}
        style="display:grid; gap:1em"
        onSubmitCompleted$={() => navigate('/documents')}
      >
        <select name="berechnungsart" id="berechnungsart-select">
          <option value="AnzahlMitarbeiter">Anzahl Mitarbeiter</option>
          <option value="Haushaltssumme">Budget Total</option>
          <option value="Umsatz">Revenue</option>
        </select>

        <select name="risiko" id="risk-select">
          <option value="Gering">Low</option>
          <option value="Mittel">Medium</option>
        </select>

        <input type="number" name="versicherungssumme" />

        <label>
          <input type="checkbox" name="hatWebshop" />
          Has Webshop
        </label>

        <label>
          <input
            onchange$={(event) =>
              (wantsAdditionalProtection.value = (
                event.target as HTMLInputElement
              ).checked)
            }
            type="checkbox"
            name="willZusatzschutz"
          />
          Wants Additional Protection
        </label>

        <select
          disabled={wantsAdditionalProtection.value === false}
          name="zusatzaufschlag"
          id="additional-protection-select"
        >
          <option value="10%">10%</option>
          <option value="20%">20%</option>
          <option value="25%">25%</option>
        </select>

        <button type="submit">Add</button>
      </Form>

      {action.value?.formErrors && <p>{JSON.stringify(action.value)}</p>}
      {action.value?.formErrors &&
        action.value.formErrors?.map((error) => <p>{error}</p>)}
    </>
  );
});
