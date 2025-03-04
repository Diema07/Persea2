from django.urls import path
from . import views

urlpatterns = [
    path('enviar/', views.enviar_notificaciones_view, name='enviar_notificaciones_view'),
]