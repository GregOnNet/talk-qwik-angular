using InsuranceDocumentsDomain;
using InsuranceDocumentsDomain.Berechnungsarten;
using InsuranceDocumentsDomain.Zusatzschutz;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceDocumentsWebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class VoreinstellungenController : ControllerBase
{
    private ILogger<VoreinstellungenController> _logger;

    public VoreinstellungenController(ILogger<VoreinstellungenController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("Berechnungsarten")]
    public ActionResult<string[]> ListeBerechnungsarten()
    {
        return Berechnungsart.List.Select(b => b.Name).ToArray();
    }

    [HttpGet]
    [Route("Risiken")]
    public ActionResult<string[]> ListeRisiken()
    {
        return Risiko.List.Select(r => r.Name).ToArray();
    }

    [HttpGet]
    [Route("ZusatzschutzAufschlaege")]
    public ActionResult<string[]> ListeZusatzschutzAufschlaege()
    {
        return Zusatzschutz.ErlaubteWerte;
    }
}
