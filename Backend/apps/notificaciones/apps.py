# apps/notificaciones/apps.py
from django.apps import AppConfig
import sys

class NotificacionesConfig(AppConfig):
    name = 'apps.notificaciones'

    def ready(self):
        # Solo inicia el scheduler si no estamos ejecutando comandos de migración u otros.
        # Por ejemplo, se puede verificar que el comando es "runserver" o "uwsgi" (si se usa).
        if len(sys.argv) > 1 and sys.argv[1] in ['runserver', 'runfcgi', 'uwsgi']:
            from . import scheduler  # Importa el módulo donde definiste el scheduler
            scheduler.start_scheduler()
        # Carga las señales
        import apps.notificaciones.signals 
