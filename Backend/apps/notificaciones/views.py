from django.shortcuts import render
from rest_framework import viewsets
from .serializer import NotificacionSerializer
from .models import Notificacion

# Create your views here.
class NotificacionView(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    queryset = Notificacion.objects.all()