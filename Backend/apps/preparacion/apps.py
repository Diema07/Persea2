from django.apps import AppConfig


class PreparacionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.preparacion'

    def ready(self):
        import apps.preparacion.signals  # Se importa el módulo de señales