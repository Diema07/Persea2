<<<<<<< HEAD
# notificaciones/views.py
from django.http import HttpResponse
from .tasks import enviar_notificaciones_task

def enviar_notificaciones_view(request):
    # Llama a la tarea de Celery de forma asíncrona
    enviar_notificaciones_task.delay()
    return HttpResponse("Tarea de envío de notificaciones lanzada.")
=======
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import NotificacionSerializer
from .models import Notificacion

# Create your views here.
class NotificacionView(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    queryset = Notificacion.objects.all()
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
