from django.urls import path, include
from rest_framework import routers
from apps.mantenimiento import views

router = routers.DefaultRouter()
router.register(r'RiegoFertilizacion', views.RiegoFertilizacionView, 'RiegoFertilizacion')
router.register(r'MantenimientoMonitoreo', views.MantenimientoMonitoreoView, 'MantenimientoMonitoreo')
router.register(r'Poda', views.PodaView, 'Poda')

urlpatterns = [
    path("api/v1/", include(router.urls))
]