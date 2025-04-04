from django.urls import path, include
from rest_framework import routers
from apps.plantaciones import views

router = routers.DefaultRouter()
router.register(r'Plantacion', views.PlantacionView, basename='Plantacion')
router.register(r'PlantacionFiltrada', views.PlantacionFiltradaView, 'PlantacionFiltrada')



urlpatterns =[
    path("api/v1/", include(router.urls))
]