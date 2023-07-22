using Ardalis.SmartEnum;
using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Berechnungsarten;

public abstract class Berechnungsart : SmartEnum<Berechnungsart>
{
    public static readonly Berechnungsart Umsatz = new Umsatz();
    public static readonly Berechnungsart Haushaltssumme = new Haushaltssumme();
    public static readonly Berechnungsart AnzahlMitarbeiter = new AnzahlMitarbeiter();

    protected Berechnungsart(string name, int value)
        : base(name, value)
    {
    }

    public static Result<Berechnungsart> TryFromName(string name)
    {
        var gueltig = TryFromName(name, true, out var berechnungsart);
        return Result.FailureIf(!gueltig, berechnungsart, $"'{name}' ist keine gültige Berechnungsart.");
    }

    public abstract Result<decimal> Berechne(Versicherungssumme versicherungssumme,
        Zusatzschutz.Zusatzschutz zusatzschutz, Risiko risiko, bool webshopVersichern);

    protected decimal Runden(decimal wert) => Math.Round(wert, 2);
}