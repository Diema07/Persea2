# notificaciones/views.py
from django.http import HttpResponse
from .tasks import enviar_notificaciones_task

def enviar_notificaciones_view(request):
    # Llama a la tarea de Celery de forma asíncrona
    enviar_notificaciones_task.delay()
    return HttpResponse("Tarea de envío de notificaciones lanzada.")
