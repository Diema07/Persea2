from django.urls import path, include
from rest_framework import routers
from apps.notificaciones import views

router = routers.DefaultRouter()
router.register(r'Notificacion', views.NotificacionView, 'Notificacion')

urlpatterns = [
    path("api/v1/", include(router.urls))
]