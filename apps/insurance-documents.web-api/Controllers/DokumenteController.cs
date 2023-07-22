using CSharpFunctionalExtensions;
using InsuranceDocumentsDomain;
using InsuranceDocumentsDomain.Berechnungsarten;
using InsuranceDocumentsDomain.Zusatzschutz;
using InsuranceDocumentsInfrastructure;
using InsuranceDocumentsWebApi.Utils;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceDocumentsWebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DokumenteController : ControllerBase
{
    private readonly IDokumentRepository _repo;
    private ILogger<DokumenteController> _logger;

    public DokumenteController(IDokumentRepository repo, ILogger<DokumenteController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DokumentenlisteEintragDto>>> DokumenteAbrufen()
    {
         var dokumente = await _repo.ListAsync();

        return dokumente
            .Select(MapToDto)
            .ToList();
    }

    [HttpGet]
    [Route("{id:guid}")]
    public async Task<ActionResult<Dokument>> DokumentFinden(Guid id)
    {
        var dokument = await _repo.FindAsync(id);

        if (dokument.HasNoValue)
            return NotFound();

        var dto = MapToDto(dokument.Value);

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult> DokumentErstellen([FromBody] ErzeugeNeuesAngebotDto erzeugeNeuesAngebotDto)
    {
        var berechnungsartOderFehler = Berechnungsart.TryFromName(erzeugeNeuesAngebotDto.Berechnungsart);
        var risikoOderFehler = Risiko.TryFromName(erzeugeNeuesAngebotDto.Risiko);
        var versicherungssummeOderFehler = Versicherungssumme.InHoehe(erzeugeNeuesAngebotDto.Versicherungssumme);
        var zusatzschutzOderFehler = Zusatzschutz.ErstelleAus(erzeugeNeuesAngebotDto.WillZusatzschutz, erzeugeNeuesAngebotDto.ZusatzschutzAufschlag);

        return await Result
            .Combine(new List<Result>
            {
                berechnungsartOderFehler,
                risikoOderFehler,
                versicherungssummeOderFehler,
                zusatzschutzOderFehler
            }, Environment.NewLine)
            .Bind(() => Dokument.NeuesLeeresAngebot(
                berechnungsartOderFehler.Value,
                risikoOderFehler.Value,
                versicherungssummeOderFehler.Value)
            )
            .CheckIf(erzeugeNeuesAngebotDto.HatWebshop, dok => dok.VersichereWebshop())
            .Check(dok => dok.KonfiguriereZusatzschutz(zusatzschutzOderFehler.Value))
            .Tap(_repo.AddAsync)
            .Tap(_repo.SaveChangesAsync)
            .Map(MapToDto)
            .Match(
                dto => (ActionResult) CreatedAtAction("DokumentFinden", "Dokumente", new { dto.Id }, dto),
                error => BadRequest(error)
                );
    }

    [HttpPost]
    [Route("{id:guid}/annehmen")]
    public async Task<ActionResult> DokumentAnnehmen([FromRoute] Guid id)
    {
        var maybeDokument = await _repo.FindAsync(id);

        return await maybeDokument
            .ToResult("Das selektierte Dokument wurde nicht gefunden.")
            .Check(dok => dok.Annehmen())
            .Tap(_ => _repo.SaveChangesAsync())
            .Envelope();
    }

    [HttpPost]
    [Route("{id:guid}/ausstellen")]
    public async Task<ActionResult> DokumentAusstellen([FromRoute] Guid id)
    {
        var maybeDokument = await _repo.FindAsync(id);

        return await maybeDokument
            .ToResult("Das selektierte Dokument wurde nicht gefunden.")
            .Check(dok => dok.Ausstellen())
            .Tap(_ => _repo.SaveChangesAsync())
            .Envelope();
    }

    private static DokumentenlisteEintragDto MapToDto(Dokument dokument)
    {
        return new DokumentenlisteEintragDto
        {
            Id = dokument.Id,
            Beitrag = dokument.Beitrag,
            Dokumenttyp = dokument.Typ.Name,
            Berechnungsart = dokument.Berechnungsart.ToString(),
            Risiko = dokument.Risiko.Name,
            Versicherungssumme = dokument.Versicherungssumme.Hoehe,
            WebshopVersichert = dokument.HatWebshop,
            Zusatzschutz = dokument.Zusatzschutz.ToString(),
            KannAngenommenWerden = dokument.KannAngenommenWerden,
            KannAusgestelltWerden = dokument.KannAusgestelltWerden
        };
    }
}

public class ErzeugeNeuesAngebotDto
{
    public bool HatWebshop { get; init; }
    public string Berechnungsart { get; init; }
    public string Risiko { get; init; }
    public bool WillZusatzschutz { get; init; }
    public string ZusatzschutzAufschlag { get; init; }
    public decimal Versicherungssumme { get; init; }
}

public class DokumentenlisteEintragDto
{
    public Guid Id { get; init; }
    public string Dokumenttyp { get; init; }
    public string Berechnungsart { get; init; }
    public string Risiko { get; init; }
    public string Zusatzschutz { get; init; }
    public bool WebshopVersichert { get; init; }
    public decimal Versicherungssumme { get; init; }
    public decimal Beitrag { get; init; }
    public bool KannAngenommenWerden { get; init; }
    public bool KannAusgestelltWerden { get; init; }
}
