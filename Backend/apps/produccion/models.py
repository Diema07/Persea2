from django.db import models

class Cosecha(models.Model):
    cantidadCosechada = models.FloatField()
    fechaCosecha = models.DateField()

    # Calidades específicas para aguacate
    kilosCalidadExportacion = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Kilos de calidad exportación"
    )
    kilosCalidadNacional = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Kilos de calidad nacional"
    )
    kilosCalidadIndustrial = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Kilos de calidad industrial"
    )

    idPlantacion = models.ForeignKey(
        'plantaciones.Plantacion',
        on_delete=models.CASCADE,
        related_name='cosechas'
    )

    def __str__(self):
        return f"Cosecha de {self.idPlantacion.nombreParcela} - {self.fechaCosecha}"
