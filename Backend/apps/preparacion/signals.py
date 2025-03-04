from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.plantaciones.models import Plantacion
from apps.preparacion.models import PreparacionTerreno, SeleccionArboles

@receiver(post_save, sender=Plantacion)
def crear_registros_asociados(sender, instance, created, **kwargs):
    if created:
        PreparacionTerreno.objects.create(
            idPlantacion=instance,
            limpiezaTerreno=None,       # Se debe permitir null en el modelo
            analisisSuelo=None,
            correcionSuelo=None,
            labranza=None,
            delimitacionParcela=0        # Valor por defecto
        )
        SeleccionArboles.objects.create(
            idPlantacion=instance,
            seleccionVariedades="",      # Cadena vacía por defecto
            preparacionColinos=None,
            excavacionHoyos=None,
            plantacion=None
        )
