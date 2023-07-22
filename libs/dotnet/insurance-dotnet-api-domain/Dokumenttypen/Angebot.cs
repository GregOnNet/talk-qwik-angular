using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Dokumenttypen;

internal class Angebot : Dokumenttyp
{
    internal Angebot()
        : base("Angebot", 1)
    {
        KannAngenommenWerden = true;
        KannAusgestelltWerden = false;
        IstAusgestellt = false;
    }

    public override Result<Dokumenttyp> Annehmen()
    {
        return Result
            .Success<Dokumenttyp>(new NichtAusgestellterVersicherungsschein());
    }

    public override Result<Dokumenttyp> Ausstellen()
    {
        return Result.Failure<Dokumenttyp>("Bitte erst das Angebot annehmen.");
    }
}