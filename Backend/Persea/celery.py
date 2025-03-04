# myproject/celery.py
import os
from celery import Celery

# Establece la configuración de Django para Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Persea.settings')

app = Celery('Persea')

# Usa un prefijo "CELERY" para que Celery lea las variables de settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descubre tareas en las apps registradas en INSTALLED_APPS
app.autodiscover_tasks()
