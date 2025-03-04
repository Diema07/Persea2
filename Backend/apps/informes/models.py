from django.db import models

class Informe(models.Model):
    tipoInforme = models.CharField(max_length=50)
    fechaGeneracion = models.DateField()
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='informes')

    def __str__(self):
        return f"Informe {self.tipoInforme} de {self.idPlantacion.nombreParcela}"