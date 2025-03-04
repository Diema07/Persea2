from django.db import models

class RiegoFertilizacion(models.Model):
    RIEGO_OPCIONES = [
        ('aspersión', 'Aspersión'),
        ('goteo', 'Goteo'),
        ('gravedad', 'Gravedad'),
    ]
    tipoRiego = models.CharField(max_length=30, null=True, blank=True)
    fechaRiego = models.DateField( null=True, blank=True)

    METODO_APLICACION_OPCIONES = [
        ('al suelo', 'Al suelo'),
        ('foliar', 'Foliar'),
        ('fertirriego', 'Fertirriego'),
    ]
    metodoAplicacionFertilizante = models.CharField(max_length=30, null=True, blank=True)

    TIPO_FERTILIZANTE_OPCIONES = [
        ('orgánico', 'Orgánico'),
        ('químico', 'Químico'),
        ('mixto', 'Mixto'),
    ]
    tipoFertilizante = models.CharField(max_length=30, null=True, blank=True)
    nombreFertilizante = models.CharField(max_length=30, null=True, blank=True)
    cantidadFertilizante = models.FloatField( null=True, blank=True)

    MEDIDA_FERTILIZANTE_OPCIONES = [
        ('kg', 'Kilogramos'),
        ('litros', 'Litros'),
        ('toneladas', 'Toneladas'),
    ]
    medidaFertilizante = models.CharField(max_length=20, null=True, blank=True)
    fechaFertilizante = models.DateField( null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='riego_fertilizacion')

    def __str__(self):
        return f"Riego/Fertilización para {self.idPlantacion.nombreParcela}"

class MantenimientoMonitoreo(models.Model):
    TIPO_TRATAMIENTO_CHOICES = [
        ('insecticida', 'Insecticida'),
        ('fungicida', 'Fungicida'),
        ('herbicida', 'Herbicida'),
    ]

    guadana = models.DateField( null=True, blank=True)
    necesidadArboles = models.CharField(max_length=30, null=True, blank=True)
    # Ahora tipoTratamiento es un CharField con opciones
    tipoTratamiento = models.CharField(
        max_length=30, null=True, blank=True,
        choices=TIPO_TRATAMIENTO_CHOICES
    )
    fechaAplicacionTratamiento = models.DateField( null=True, blank=True)
    idPlantacion = models.ForeignKey(
        'plantaciones.Plantacion',
        on_delete=models.CASCADE,
        related_name='mantenimiento'
    )

    def __str__(self):
        return f"Mantenimiento de {self.idPlantacion.nombreParcela}"


class Poda(models.Model):

    TIPOS_PODA = [
        ('formacion', 'Formación'),
        ('mantenimiento', 'Mantenimiento'),
        ('sanitaria', 'Sanitaria'),
    ]
    tipoPoda = models.CharField(max_length=30, null=True, blank=True)

    HERRAMIENTAS_USADAS = [
        ('tijeras', 'Tijeras'),
        ('serrucho', 'Serrucho'),
        ('motosierra', 'Motosierra'),
    ]
    herramientasUsadas = models.CharField(max_length=60, null=True, blank=True)

    TECNICAS_USADAS = [
        ('ralo', 'Raleo'),
        ('deschuponado', 'Deschuponado'),
        ('rebaje', 'Rebaje'),
    ]

    tecnicasUsadas = models.CharField(max_length=60, null=True, blank=True)
    fechaPoda = models.DateField( null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='podas')

    def __str__(self):
        return f"Poda de {self.idPlantacion.nombreParcela}"