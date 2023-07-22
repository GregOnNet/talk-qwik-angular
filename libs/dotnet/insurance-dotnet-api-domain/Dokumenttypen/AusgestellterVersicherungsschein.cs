using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Dokumenttypen;

public class AusgestellterVersicherungsschein: Dokumenttyp
{
    internal AusgestellterVersicherungsschein()
        : base("Versicherungsschein", 3)
    {
        KannAngenommenWerden = false;
        KannAusgestelltWerden = false;
        IstAusgestellt = true;
    }

    public override Result<Dokumenttyp> Annehmen()
    {
        return Result.Failure<Dokumenttyp>("Das ursprüngliche Angebot wurde bereits angenommen");
    }

    public override Result<Dokumenttyp> Ausstellen()
    {
        return Result.Failure<Dokumenttyp>("Dieser Versicherungsschein wurde bereits ausgestellt");
    }
}