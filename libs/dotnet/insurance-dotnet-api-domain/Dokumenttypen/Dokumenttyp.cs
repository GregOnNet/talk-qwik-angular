using Ardalis.SmartEnum;
using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain.Dokumenttypen;

public abstract class Dokumenttyp
    : SmartEnum<Dokumenttyp>
{
    public static readonly Dokumenttyp Angebot = new Angebot();

    ///<Summary>
    /// This is for EF Deserialization and should be removed when <see href="https://github.com/ardalis/SmartEnum/issues/405">this Issue</see> is closed
    ///</Summary>
    public static readonly Dokumenttyp NichtAusgestellterVersicherungsschein = new NichtAusgestellterVersicherungsschein();
    public static readonly Dokumenttyp AusgestellterVersicherungsschein = new AusgestellterVersicherungsschein();

    protected Dokumenttyp(string name, int value)
        : base(name, value)
    {
    }

    public bool KannAngenommenWerden { get; protected init; }

    public bool IstAusgestellt { get; protected set; }
    public bool KannAusgestelltWerden { get; protected set; }

    public abstract Result<Dokumenttyp> Annehmen();
    public abstract Result<Dokumenttyp> Ausstellen();
}
