from django.dispatch import Signal, receiver
from .models import Plantacion
from apps.preparacion.models import PreparacionTerreno, SeleccionArboles

# Definir una señal personalizada que envíe la plantación que se completó
plantacion_completada = Signal()

@receiver(plantacion_completada)
def duplicar_registros(sender, plantacion, **kwargs):
    if plantacion.estado != 'COMPLETA':
        plantacion.estado = 'COMPLETA'
        plantacion.save()

    # Crear la nueva plantación
    nueva_plantacion = Plantacion.objects.create(
        nombreParcela=f"{plantacion.nombreParcela}",
        idUsuario=plantacion.idUsuario,
        estado='ACTIVA'
    )

    # Eliminar los registros creados automáticamente en la nueva plantación
    PreparacionTerreno.objects.filter(idPlantacion=nueva_plantacion).delete()
    SeleccionArboles.objects.filter(idPlantacion=nueva_plantacion).delete()

    # Duplicar todos los registros de PreparacionTerreno asociados
    preparaciones = PreparacionTerreno.objects.filter(idPlantacion=plantacion)
    for prep in preparaciones:
        prep.pk = None  # Reinicia el PK
        prep.idPlantacion = nueva_plantacion
        prep.completado = True
        prep.save()

    # Duplicar todos los registros de SeleccionArboles asociados
    seleccion_arboles = SeleccionArboles.objects.filter(idPlantacion=plantacion)
    for sel in seleccion_arboles:
        sel.pk = None
        sel.idPlantacion = nueva_plantacion
        sel.completado = True
        sel.save()
