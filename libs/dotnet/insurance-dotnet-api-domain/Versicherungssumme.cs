using CSharpFunctionalExtensions;

namespace InsuranceDocumentsDomain;

public struct Versicherungssumme
{
    public required decimal Hoehe { get; init; }

    public static Result<Versicherungssumme> InHoehe(decimal versicherungssumme)
    {
        var versicherungssummeZuNiedrig = "Versicherungssumme muss mehr als 0€ sein.";

        return Result
            .FailureIf(versicherungssumme <= 0,
                new Versicherungssumme { Hoehe = versicherungssumme },
                versicherungssummeZuNiedrig);
    }

    public static implicit operator decimal(Versicherungssumme vs) => vs.Hoehe;
    public static implicit operator double(Versicherungssumme vs) => (double) vs.Hoehe;
    public static explicit operator Versicherungssumme(decimal hoehe) => InHoehe(hoehe).Value;

    public override string ToString()
    {
        return Hoehe.ToString("C0");
    }
}
