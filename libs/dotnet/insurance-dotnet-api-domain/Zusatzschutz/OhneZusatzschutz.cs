namespace InsuranceDocumentsDomain.Zusatzschutz;

internal class OhneZusatzschutz : Zusatzschutz
{
    internal OhneZusatzschutz()
    {
        AufschlagInProzent = 0f;
    }

    public override bool IstAktiviert => false;
    internal override decimal AufschlagInBeitragsberechnung => 1.0m;

    public override string ToString()
    {
        return "-";
    }
}