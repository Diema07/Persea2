# notificaciones/management/commands/enviar_notificaciones.py
from django.core.management.base import BaseCommand
from notificaciones.utils import enviar_notificaciones

class Command(BaseCommand):
    help = 'Envía notificaciones a usuarios inactivos (no han iniciado sesión en 7 días)'

    def handle(self, *args, **kwargs):
        enviar_notificaciones()
        self.stdout.write(self.style.SUCCESS("Notificaciones enviadas correctamente."))
