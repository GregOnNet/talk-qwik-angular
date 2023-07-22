using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Berechnungsarten;

internal class  AnzahlMitarbeiter : Berechnungsart
{
    internal AnzahlMitarbeiter()
        : base("AnzahlMitarbeiter", 3)
    {
    }

    public override Result<decimal> Berechne(Versicherungssumme versicherungssumme,
        Zusatzschutz.Zusatzschutz zusatzschutz, Risiko risiko, bool webshopVersichern)
    {
        if (webshopVersichern)
        {
            return Result.Failure<decimal>("Bei Abrechnung nach Mitarbeitern können keine Webshops versichert werden.");
        }

        var anzahlMitarbeiter = versicherungssumme.Hoehe;
        var limitMitarbeiterFuerZusatzschutz = 5;

        if (anzahlMitarbeiter > limitMitarbeiterFuerZusatzschutz
            && zusatzschutz != Zusatzschutz.Zusatzschutz.Deaktiviert)
        {
            var fehler =
                $"Bei mehr als {limitMitarbeiterFuerZusatzschutz} Mitarbeitern kann kein Zusatzschutz gewährt werden.";
            return Result.Failure<decimal>(fehler);
        }

        var berechnungsbasis = anzahlMitarbeiter / 1000;
        var beitrag = berechnungsbasis * zusatzschutz.AufschlagInBeitragsberechnung * 50m;

        if (berechnungsbasis < 4)
            beitrag *= 5m;
        else
            beitrag *= 4m;

        if (risiko == Risiko.Mittel)
            beitrag *= 1.3m;

        return Result.Success(Runden(beitrag));
    }
}