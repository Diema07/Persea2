from django.apps import AppConfig


class PlantacionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.plantaciones'

    def ready(self):
        import apps.plantaciones.signals  # Importa las señales