using CSharpFunctionalExtensions;
using InsuranceDocumentsDomain;

namespace InsuranceDocumentsInfrastructure;

public interface IDokumentRepository
{
    Task<Maybe<Dokument>> FindAsync(Guid id);
    Task<List<Dokument>> ListAsync();
    Task AddAsync(Dokument dokument);
    Task SaveChangesAsync();
}
