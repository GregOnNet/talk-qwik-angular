using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Zusatzschutz;

public abstract class Zusatzschutz : ValueObject
{
    protected static readonly HashSet<float> GueltigeAufschlage = new() {10f, 20f, 25f};
    public static readonly string[] ErlaubteWerte = GueltigeAufschlage.Select(wert => $"{wert}%").ToArray();

    public abstract bool IstAktiviert { get; }
    public bool IstDeaktiviert => !IstAktiviert;
    public float AufschlagInProzent { get; init; }

    internal abstract decimal AufschlagInBeitragsberechnung { get; }

    public static Zusatzschutz Deaktiviert => new OhneZusatzschutz();

    public static Result<Zusatzschutz> Aktiviert(float prozent)
    {
        return MitZusatzschutz.TryCreate(prozent);
    }

    public static Result<Zusatzschutz> ErstelleAus(bool aktiviert, string aufschlag)
    {
        return aktiviert
            ? MitZusatzschutz.TryCreate(aufschlag)
            : new OhneZusatzschutz();
    }

    public static implicit operator float(Zusatzschutz zs)
    {
        return zs.AufschlagInProzent;
    }

    public static implicit operator decimal(Zusatzschutz zs)
    {
        return (decimal) zs.AufschlagInProzent;
    }

    public static explicit operator Zusatzschutz(float p)
    {
        return Aktiviert(p)
            .OnFailureCompensate(() => new OhneZusatzschutz())
            .Value;
    }

    public override string ToString()
    {
        return IstAktiviert ? "-" : $"{AufschlagInProzent}%";
    }

    protected override IEnumerable<IComparable> GetEqualityComponents()
    {
        yield return AufschlagInProzent;
        yield return IstAktiviert;
    }
}