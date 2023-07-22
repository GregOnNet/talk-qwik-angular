import { z } from '@builder.io/qwik-city';

export const CreateInsuranceDocumentDtoSchema = z.object({
  berechnungsart: z.string(),
  willZusatzschutz: z.boolean().default(false),
  zusatzschutzAufschlag: z.string().default(''),
  hatWebshop: z
    .preprocess((value) => value === 'on', z.boolean())
    .default(false),

  risiko: z.string(),
  versicherungssumme: z.preprocess(
    (value) => parseFloat(z.string().parse(value)),
    z.number().positive(),
  ),
});

export type CreateInsuranceDocumentDto = z.infer<
  typeof CreateInsuranceDocumentDtoSchema
>;
