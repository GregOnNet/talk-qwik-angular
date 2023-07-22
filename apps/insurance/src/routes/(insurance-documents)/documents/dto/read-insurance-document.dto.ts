export interface ReadInsuranceDocumentDto {
  id: string;
  dokumenttyp: string;
  berechnungsart: string;
  zusatzschutz: string;
  webshopVersichert: boolean;
  risiko: string;
  versicherungssumme: number;
  beitrag: number;
  kannAngenommenWerden: boolean;
  kannAusgestelltWerden: boolean;
}
