using Ardalis.SmartEnum;
using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain;

public class Risiko : SmartEnum<Risiko>
{
    public static readonly Risiko Gering = new("Gering", 1);
    public static readonly Risiko Mittel = new("Mittel", 2);

    private Risiko(string name, int value) 
        : base(name, value)
    {
    }

    public static Result<Risiko> TryFromName(string name)
    {
        var gueltig = Risiko.TryFromName(name, true, out var risiko);
        return Result.FailureIf(!gueltig, risiko, $"'{name}' ist keine gültige Risiko-Bewertung.");
    }
}