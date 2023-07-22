using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Berechnungsarten;

internal class Umsatz : Berechnungsart
{
    internal Umsatz()
        : base("Umsatz", 1)
    {
    }

    public override Result<decimal> Berechne(Versicherungssumme versicherungssumme,
        Zusatzschutz.Zusatzschutz zusatzschutz, Risiko risiko, bool webshopVersichern)
    {
        if (versicherungssumme.Hoehe > 100000m
            && zusatzschutz.IstAktiviert
            && risiko == Risiko.Gering)
        {
            var fehler =
                "Umsätze mit abgeschlossenem Zusatzschutzu und Versicherungssummer größer 100.000€ können nicht mit geringem Risiko versichert werden.";

            return Result.Failure<decimal>(fehler);
        }

        var beitrag = 1.1m * (decimal)Math.Pow(versicherungssumme, 0.25d) * zusatzschutz.AufschlagInBeitragsberechnung;

        if (webshopVersichern) //Webshop gibt es nur bei Unternehmen, die nach Umsatz abgerechnet werden
            beitrag *= 2;

        if (risiko == Risiko.Mittel)
            beitrag *= 1.2m;

        return Result.Success(Runden(beitrag));
    }
}