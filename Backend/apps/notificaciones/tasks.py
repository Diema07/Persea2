# notificaciones/tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from .utils import enviar_notificaciones

User = get_user_model()

@shared_task
def enviar_notificaciones_task():
    # Selecciona usuarios que no han iniciado sesión en los últimos 7 días
    umbral = timezone.now() - timedelta(days=7)
    usuarios = User.objects.filter(last_login__lte=umbral)
    enviar_notificaciones(usuarios)
