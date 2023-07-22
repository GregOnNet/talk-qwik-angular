using InsuranceDocumentsDomain;
using Microsoft.EntityFrameworkCore;
using SmartEnum.EFCore;

namespace InsuranceDocumentsInfrastructure;

public class DokumentDbContext : DbContext
{
    public DokumentDbContext(DbContextOptions<DokumentDbContext> options)
        : base(options)
    {
    }

    public DbSet<Dokument> Dokumente => Set<Dokument>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new DokumentConfiguration());
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.ConfigureSmartEnum();
    }
}
