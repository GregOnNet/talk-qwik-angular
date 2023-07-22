using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Zusatzschutz;

internal class MitZusatzschutz : Zusatzschutz
{
    private MitZusatzschutz(float aufschlagInProzent)
    {
        AufschlagInProzent = aufschlagInProzent;
    }

    public override bool IstAktiviert => true;

    internal override decimal AufschlagInBeitragsberechnung
    {
        get
        {
            var multiplikator = 1f + AufschlagInProzent * 0.01;
            return (decimal) multiplikator;
        }
    }

    internal static Result<Zusatzschutz> TryCreate(string aufschlag)
    {
        return ExtrahiereAufschlag(aufschlag)
            .Bind(TryCreate);
    }

    internal static Result<Zusatzschutz> TryCreate(float aufschlag)
    {
        return Result
            .FailureIf<Zusatzschutz>(!GueltigeAufschlage.Contains(aufschlag),
                new MitZusatzschutz(aufschlag),
                "Der ausgewählte Aufschlag ist nicht erlaubt.");
    }

    private static Result<float> ExtrahiereAufschlag(string aufschlag)
    {
        var keinAufschlag = "Es wurde kein Aufschlag für den Zusatzschutz angegeben.";
        var keineZahl = "Der Aufschlag für den Zusatzschutz ist keine Zahl.";

        return Result
            .FailureIf(string.IsNullOrWhiteSpace(aufschlag), aufschlag, keinAufschlag)
            .Map(w => w.Replace("%", string.Empty))
            .BindTry(w =>
            {
                var istZahl = float.TryParse(w, out var aufschlagInProzent);
                return Result.FailureIf(!istZahl, aufschlagInProzent, keineZahl);
            });
    }

    public override string ToString()
    {
        return $"{AufschlagInProzent}%";
    }
}