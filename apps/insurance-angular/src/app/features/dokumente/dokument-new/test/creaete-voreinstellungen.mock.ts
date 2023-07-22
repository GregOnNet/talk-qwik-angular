import { VoreinstellungenReadDto } from '../../models';

export function createVoreinstellungen(
  overrides?: Partial<VoreinstellungenReadDto>
): VoreinstellungenReadDto {
  return {
    berechnungsarten: ['Anzahl Mitarbeiter', 'Umsatz'],
    risiken: ['Gering', 'Mittel'],
    zusatzaufschlaege: ['10%', '20%'],
    ...overrides,
  };
}
