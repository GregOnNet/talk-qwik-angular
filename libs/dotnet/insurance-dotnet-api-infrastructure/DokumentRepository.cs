using CSharpFunctionalExtensions;
using InsuranceDocumentsDomain;
using Microsoft.EntityFrameworkCore;

namespace InsuranceDocumentsInfrastructure;

public class DokumentRepository : IDokumentRepository
{
    private readonly DokumentDbContext _context;

    public DokumentRepository(DokumentDbContext context)
    {
        _context = context;
    }

    public async Task<Maybe<Dokument>> FindAsync(Guid id)
    {
        return (await _context
            .FindAsync<Dokument>(id))!;
    }

    public async Task<List<Dokument>> ListAsync()
    {
        return await _context
            .Dokumente
            .ToListAsync();
    }

    public async Task AddAsync(Dokument dokument)
    {
        await _context.Dokumente.AddAsync(dokument);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
