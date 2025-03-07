from django.db import models

class PreparacionTerreno(models.Model):
    limpiezaTerreno = models.DateField(null=True, blank=True)
    analisisSuelo = models.DateField(null=True, blank=True)
    correcionSuelo = models.DateField(null=True, blank=True)
    labranza = models.DateField(null=True, blank=True)
    delimitacionParcela = models.FloatField(default=0)
    completado = models.BooleanField(default=False)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='preparaciones')
    

    def __str__(self):
        return f"Preparación de {self.idPlantacion.nombreParcela}"

class SeleccionArboles(models.Model):
    VARIEDADES_CHOICES = [
        ('aguacate hass', 'Aguacate Hass'),
        ('aguacate criollo', 'Aguacate Criollo'),
        ('aguacate papelillo', 'Aguacate Papelillo'),
    ]

    seleccionVariedades = models.CharField(
        max_length=50,
        choices=VARIEDADES_CHOICES
    )
    preparacionColinos = models.DateField(null=True, blank=True, default=None)
    excavacionHoyos = models.DateField(null=True, blank=True)
    plantacion = models.DateField(null=True, blank=True)
    completado = models.BooleanField(default=False)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='seleccion_arboles')

    def __str__(self):
        return f"Selección de árboles para {self.idPlantacion.nombreParcela}"
    
