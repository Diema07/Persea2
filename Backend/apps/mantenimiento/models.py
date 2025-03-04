from django.db import models

class RiegoFertilizacion(models.Model):
    RIEGO_OPCIONES = [
        ('aspersión', 'Aspersión'),
        ('goteo', 'Goteo'),
        ('gravedad', 'Gravedad'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "tipoRiego"
    tipoRiego = models.CharField(max_length=30, null=True, blank=True, choices=RIEGO_OPCIONES)
    fechaRiego = models.DateField(null=True, blank=True)
=======
    tipoRiego = models.CharField(max_length=30, null=True, blank=True)
    fechaRiego = models.DateField( null=True, blank=True)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    METODO_APLICACION_OPCIONES = [
        ('al suelo', 'Al suelo'),
        ('foliar', 'Foliar'),
        ('fertirriego', 'Fertirriego'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "metodoAplicacionFertilizante"
    metodoAplicacionFertilizante = models.CharField(max_length=30, null=True, blank=True, choices=METODO_APLICACION_OPCIONES)
=======
    metodoAplicacionFertilizante = models.CharField(max_length=30, null=True, blank=True)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    TIPO_FERTILIZANTE_OPCIONES = [
        ('orgánico', 'Orgánico'),
        ('químico', 'Químico'),
        ('mixto', 'Mixto'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "tipoFertilizante"
    tipoFertilizante = models.CharField(max_length=30, null=True, blank=True, choices=TIPO_FERTILIZANTE_OPCIONES)
    nombreFertilizante = models.CharField(max_length=30, null=True, blank=True)
    cantidadFertilizante = models.FloatField(null=True, blank=True)
=======
    tipoFertilizante = models.CharField(max_length=30, null=True, blank=True)
    nombreFertilizante = models.CharField(max_length=30, null=True, blank=True)
    cantidadFertilizante = models.FloatField( null=True, blank=True)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    MEDIDA_FERTILIZANTE_OPCIONES = [
        ('kg', 'Kilogramos'),
        ('litros', 'Litros'),
        ('toneladas', 'Toneladas'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "medidaFertilizante"
    medidaFertilizante = models.CharField(max_length=20, null=True, blank=True, choices=MEDIDA_FERTILIZANTE_OPCIONES)
    fechaFertilizante = models.DateField(null=True, blank=True)
=======
    medidaFertilizante = models.CharField(max_length=20, null=True, blank=True)
    fechaFertilizante = models.DateField( null=True, blank=True)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='riego_fertilizacion')

    def __str__(self):
        return f"Riego/Fertilización para {self.idPlantacion.nombreParcela}"

<<<<<<< HEAD

=======
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
class MantenimientoMonitoreo(models.Model):
    TIPO_TRATAMIENTO_CHOICES = [
        ('insecticida', 'Insecticida'),
        ('fungicida', 'Fungicida'),
        ('herbicida', 'Herbicida'),
    ]

<<<<<<< HEAD
    guadana = models.DateField(null=True, blank=True)
    necesidadArboles = models.CharField(max_length=30, null=True, blank=True)
    # Se aplica la lista de opciones a "tipoTratamiento"
    tipoTratamiento = models.CharField(max_length=30, null=True, blank=True, choices=TIPO_TRATAMIENTO_CHOICES)
    fechaAplicacionTratamiento = models.DateField(null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='mantenimiento')
=======
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
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    def __str__(self):
        return f"Mantenimiento de {self.idPlantacion.nombreParcela}"


class Poda(models.Model):
<<<<<<< HEAD
=======

>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
    TIPOS_PODA = [
        ('formacion', 'Formación'),
        ('mantenimiento', 'Mantenimiento'),
        ('sanitaria', 'Sanitaria'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "tipoPoda"
    tipoPoda = models.CharField(max_length=30, null=True, blank=True, choices=TIPOS_PODA)
=======
    tipoPoda = models.CharField(max_length=30, null=True, blank=True)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    HERRAMIENTAS_USADAS = [
        ('tijeras', 'Tijeras'),
        ('serrucho', 'Serrucho'),
        ('motosierra', 'Motosierra'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "herramientasUsadas"
    herramientasUsadas = models.CharField(max_length=60, null=True, blank=True, choices=HERRAMIENTAS_USADAS)
=======
    herramientasUsadas = models.CharField(max_length=60, null=True, blank=True)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7

    TECNICAS_USADAS = [
        ('ralo', 'Raleo'),
        ('deschuponado', 'Deschuponado'),
        ('rebaje', 'Rebaje'),
    ]
<<<<<<< HEAD
    # Se aplica la lista de opciones a "tecnicasUsadas"
    tecnicasUsadas = models.CharField(max_length=60, null=True, blank=True, choices=TECNICAS_USADAS)
    fechaPoda = models.DateField(null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='podas')

    def __str__(self):
        return f"Poda de {self.idPlantacion.nombreParcela}"
=======

    tecnicasUsadas = models.CharField(max_length=60, null=True, blank=True)
    fechaPoda = models.DateField( null=True, blank=True)
    idPlantacion = models.ForeignKey('plantaciones.Plantacion', on_delete=models.CASCADE, related_name='podas')

    def __str__(self):
        return f"Poda de {self.idPlantacion.nombreParcela}"
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
