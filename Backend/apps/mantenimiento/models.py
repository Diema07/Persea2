from django.db import models

class RiegoFertilizacion(models.Model):
    RIEGO_OPCIONES = [
        ('aspersión', 'Aspersión'),
        ('goteo', 'Goteo'),
        ('gravedad', 'Gravedad'),
    ]
    tipoRiego = models.CharField(max_length=30, null=True, blank=True, choices=RIEGO_OPCIONES)
    fechaRiego = models.DateField(null=True, blank=True)

    METODO_APLICACION_OPCIONES = [
        ('al suelo', 'Al suelo'),
        ('foliar', 'Foliar'),
        ('fertirriego', 'Fertirriego'),
    ]
    metodoAplicacionFertilizante = models.CharField(max_length=30, null=True, blank=True, choices=METODO_APLICACION_OPCIONES)

    TIPO_FERTILIZANTE_OPCIONES = [
        ('orgánico', 'Orgánico'),
        ('químico', 'Químico'),
        ('mixto', 'Mixto'),
    ]
    tipoFertilizante = models.CharField(max_length=30, null=True, blank=True, choices=TIPO_FERTILIZANTE_OPCIONES)
    nombreFertilizante = models.CharField(max_length=30, null=True, blank=True)
    cantidadFertilizante = models.FloatField(null=True, blank=True)

    MEDIDA_FERTILIZANTE_OPCIONES = [
        ('kg', 'Kilogramos'),
        ('gr', 'Gramos'),
        ('litros', 'Litros'),
        ('ml', 'mililitros'),
    ]
    medidaFertilizante = models.CharField(max_length=20, null=True, blank=True, choices=MEDIDA_FERTILIZANTE_OPCIONES)
    fechaFertilizante = models.DateField(null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='riego_fertilizacion')

    def __str__(self):
        return f"Riego/Fertilización para {self.idPlantacion.nombreParcela}"

class MantenimientoMonitoreo(models.Model):
    guadana = models.DateField(null=True, blank=True)

    METODO_APLICACION_OPCIONES = [
        ('al suelo', 'Al suelo'),
        ('foliar', 'Foliar'),
    ]
    metodoAplicacionFumigacion = models.CharField(max_length=30, null=True, blank=True, choices=METODO_APLICACION_OPCIONES)

    TIPO_TRATAMIENTO_CHOICES = [
        ('insecticida', 'Insecticida'),
        ('fungicida', 'Fungicida'),
        ('herbicida', 'Herbicida'),
    ]
    tipoTratamiento = models.CharField(max_length=30, null=True, blank=True, choices=TIPO_TRATAMIENTO_CHOICES)
    fechaAplicacionTratamiento = models.DateField(null=True, blank=True)
    nombreTratamiento = models.CharField(max_length=30, null=True, blank=True)
    cantidadTratamiento = models.FloatField(null=True, blank=True)
    observacion = models.CharField(max_length=200, null=True, blank=True)
    MEDIDA_TRATAMIENTO_OPCIONES = [
        ('kg', 'Kilogramos'),
        ('gr', 'Gramos'),
        ('litros', 'Litros'),
        ('ml', 'mililitros'),
    ]
    medidaTratamiento = models.CharField(max_length=20, null=True, blank=True, choices=MEDIDA_TRATAMIENTO_OPCIONES)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='mantenimiento')

    def __str__(self):
        return f"Mantenimiento de {self.idPlantacion.nombreParcela}"

class Poda(models.Model):
    TIPOS_PODA = [
        ('formacion', 'Formación'),
        ('mantenimiento', 'Mantenimiento'),
        ('sanitaria', 'Sanitaria'),
        ('rejuvenecimiento', 'Rejuvenecimiento'),
    ]
    tipoPoda = models.CharField(max_length=30, null=True, blank=True, choices=TIPOS_PODA)

    HERRAMIENTAS_USADAS = [
        ('tijeras', 'Tijeras'),
        ('serrucho', 'Serrucho'),
        ('motosierra', 'Motosierra'),
    ]
    herramientasUsadas = models.CharField(max_length=60, null=True, blank=True, choices=HERRAMIENTAS_USADAS)

    TECNICAS_USADAS = [
        ('ralo', 'Raleo'),
        ('deschuponado', 'Deschuponado'),
        ('rebaje', 'Rebaje'),
    ]
    tecnicasUsadas = models.CharField(max_length=60, null=True, blank=True, choices=TECNICAS_USADAS)
    fechaPoda = models.DateField(null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='podas')

    def __str__(self):
        return f"Poda de {self.idPlantacion.nombreParcela}"