from django.db import models

class Notificacion(models.Model):
    tipoNotificacion = models.CharField(max_length=50)
    fechaNotificacion = models.DateField()
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='notificaciones')

    def __str__(self):
        return f"Notificación: {self.tipoNotificacion} para {self.idPlantacion.nombreParcela}"