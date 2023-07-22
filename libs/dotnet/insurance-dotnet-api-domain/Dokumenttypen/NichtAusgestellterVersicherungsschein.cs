using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Dokumenttypen;

internal class NichtAusgestellterVersicherungsschein : Dokumenttyp
{
    internal NichtAusgestellterVersicherungsschein()
        : base("Versicherungsschein", 2)
    {
        KannAngenommenWerden = false;
        KannAusgestelltWerden = true;
        IstAusgestellt = false;
    }

    public override Result<Dokumenttyp> Annehmen()
    {
        return Result.Failure<Dokumenttyp>("Das ursprüngliche Angebot wurde bereits angenommen");
    }

    public override Result<Dokumenttyp> Ausstellen()
    {
        return Result
            .Success<Dokumenttyp>(new AusgestellterVersicherungsschein());
    }
}