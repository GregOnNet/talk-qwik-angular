using CSharpFunctionalExtensions;
using InsuranceDocumentsDomain.Berechnungsarten;
using InsuranceDocumentsDomain.Dokumenttypen;

namespace InsuranceDocumentsDomain;

public class Dokument
{
#pragma warning disable CS8618
    private Dokument() { }
#pragma warning restore CS8618

    private Dokument(Guid id, Berechnungsart berechnungsart, Risiko risiko,
        Versicherungssumme versicherungssumme)
    {
        Id = id;
        Typ = Dokumenttyp.Angebot;
        Berechnungsart = berechnungsart;
        Risiko = risiko;
        Versicherungssumme = versicherungssumme;
        Zusatzschutz = InsuranceDocumentsDomain.Zusatzschutz.Zusatzschutz.Deaktiviert;
    }

    public Guid Id { get; }

    public Dokumenttyp Typ { get; private set; }
    public Berechnungsart Berechnungsart { get; }
    /// <summary>
    /// Berechnungsart Umsatz => Jahresumsatz in Euro,
    /// Berechnungsart Haushaltssumme => Haushaltssumme in Euro,
    /// Berechnungsart AnzahlMitarbeiter => Ganzzahl
    /// </summary>
    public decimal Berechnungbasis { get; set; }

    public Zusatzschutz.Zusatzschutz Zusatzschutz { get; internal set; }

    //Gibt es nur bei Unternehmen, die nach Umsatz abgerechnet werden
    public bool HatWebshop { get; private set; }

    public Risiko Risiko { get; internal set; }

    public decimal Beitrag { get; internal set; }

    public bool VersicherungsscheinAusgestellt => Typ.IstAusgestellt;
    public Versicherungssumme Versicherungssumme { get; }

    public bool KannAusgestelltWerden => Typ.KannAusgestelltWerden;

    public bool KannAngenommenWerden => Typ.KannAngenommenWerden;

    public Result Ausstellen()
    {
        return Typ
            .Ausstellen()
            .Tap(neuerTyp => Typ = neuerTyp);
    }

    public Result Annehmen()
    {
        return Typ
            .Annehmen()
            .Tap(neuerTyp => Typ = neuerTyp);
    }

    public Result VersichereWebshop()
    {
        if (HatWebshop)
            return Result.Success();

        return Berechnungsart
            .Berechne(Versicherungssumme, Zusatzschutz, Risiko, true)
            .Tap(_ => HatWebshop = true)
            .Tap(ergebnis => Beitrag = ergebnis);
    }

    public Result KonfiguriereZusatzschutz(Zusatzschutz.Zusatzschutz zusatzschutz)
    {
        return Berechnungsart
            .Berechne(Versicherungssumme, zusatzschutz, Risiko, HatWebshop)
            .Tap(_ => Zusatzschutz = zusatzschutz)
            .Tap(ergebnis => Beitrag = ergebnis);
    }

    public static Result<Dokument> NeuesLeeresAngebot(Berechnungsart berechnungsart, Risiko risiko,
        Versicherungssumme versicherungssumme)
    {
        return Result
            .Success()
            .Map(() => new Dokument(Guid.NewGuid(), berechnungsart, risiko, versicherungssumme))
            .Check(dok =>
            {
                return dok
                    .Berechnungsart
                    .Berechne(dok.Versicherungssumme, dok.Zusatzschutz, dok.Risiko, dok.HatWebshop)
                    .Tap(ergebnis => dok.Beitrag = ergebnis);
            });
    }
}
