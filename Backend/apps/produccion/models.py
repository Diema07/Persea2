from django.db import models

class Cosecha(models.Model):
    fechaCosecha = models.DateField(auto_now_add=True)
    cantidadAltaCalidad = models.FloatField()
    cantidadMedianaCalidad = models.FloatField()
    cantidadBajaCalidad = models.FloatField()
    cantidadTotal = models.FloatField()
    completado = models.BooleanField(default=False)



    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='cosechas')

    def __str__(self):
        return f"Cosecha de {self.idPlantacion.nombreParcela} - {self.fechaCosecha}"
