using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Berechnungsarten;

internal class Haushaltssumme : Berechnungsart
{
    internal Haushaltssumme()
        : base("Haushaltssumme", 2)
    {
    }

    public override Result<decimal> Berechne(Versicherungssumme versicherungssumme,
        Zusatzschutz.Zusatzschutz zusatzschutz, Risiko risiko, bool webshopVersichern)
    {
        if (webshopVersichern)
        {
            return Result.Failure<decimal>("Bei Haushalten können keine Webshops versichert werden.");
        }

        if (risiko == Risiko.Gering)
        {
            var fehler = "Haushalte können nicht mit geringem Risiko versichert werden.";
            return Result.Failure<decimal>(fehler);
        }

        var beitrag = ((decimal)Math.Log10(versicherungssumme) + 100m) * 1.2m * zusatzschutz.AufschlagInBeitragsberechnung;

        return Result.Success(Runden(beitrag));
    }
}