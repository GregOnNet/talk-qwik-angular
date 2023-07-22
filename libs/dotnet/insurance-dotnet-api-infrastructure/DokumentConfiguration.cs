using InsuranceDocumentsDomain;
using InsuranceDocumentsDomain.Zusatzschutz;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InsuranceDocumentsInfrastructure;

public class DokumentConfiguration : IEntityTypeConfiguration<Dokument>
{
    public void Configure(EntityTypeBuilder<Dokument> builder)
    {
        builder
            .HasKey(dok => dok.Id);

        builder
            .Property(dok => dok.Berechnungbasis)
            .IsRequired();

        builder
            .Property(dok => dok.Zusatzschutz)
            .HasConversion(
                v => (float)v,
                v => (Zusatzschutz)v)
            .IsRequired();

        builder
            .Property(dok => dok.HatWebshop)
            .IsRequired();

        builder
            .Property(dok => dok.Risiko)
            .HasConversion(
                v => (int)v,
                v => (Risiko)v)
            .IsRequired();

        builder
            .Property(dok => dok.Beitrag)
            .IsRequired();

        builder
            .Property(dok => dok.Typ)
            .IsRequired();

        builder
            .Property(dok => dok.Versicherungssumme)
            .HasConversion(
                v => (decimal) v,
                v => (Versicherungssumme) v)
            .IsRequired();

        builder
            .Property(dok => dok.Berechnungsart)
            .IsRequired();
    }
}
