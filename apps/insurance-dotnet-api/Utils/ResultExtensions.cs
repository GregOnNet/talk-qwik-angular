using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceDocumentsWebApi.Utils;

public static class ResultExtensions
{
    public static ActionResult Envelope(this Result result) =>
        result.IsFailure
            ? new BadRequestObjectResult(result.Error)
            : new OkResult();

    public static async Task<ActionResult> Envelope<T>(this Task<Result<T>> resultTask)
    {
        var result = await resultTask;
        return Envelope(result);
    }
}
