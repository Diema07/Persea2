from django.db import models

class Cosecha(models.Model):
<<<<<<< HEAD
    fechaCosecha = models.DateField(auto_now_add=True)
    cantidadAltaCalidad = models.FloatField()
    cantidadMedianaCalidad = models.FloatField()
    cantidadBajaCalidad = models.FloatField()


    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='cosechas')
=======
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
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    def __str__(self):
        return f"Cosecha de {self.idPlantacion.nombreParcela} - {self.fechaCosecha}"
