<<<<<<< HEAD
from django.urls import path
from . import views

urlpatterns = [
    path('enviar/', views.enviar_notificaciones_view, name='enviar_notificaciones_view'),
=======
from django.urls import path, include
from rest_framework import routers
from apps.notificaciones import views

router = routers.DefaultRouter()
router.register(r'Notificacion', views.NotificacionView, 'Notificacion')

urlpatterns = [
    path("api/v1/", include(router.urls))
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
]