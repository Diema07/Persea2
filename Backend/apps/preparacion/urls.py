from django.urls import path, include
from rest_framework import routers
from apps.preparacion import views

router = routers.DefaultRouter()
router.register(r'PreparacionTerreno', views.PreparacionTerrenoView, 'PreparacionTerreno')
router.register(r'SeleccionArboles', views.SeleccionArbolesView, 'SeleccionArboles')

urlpatterns = [
    path("api/v1/", include(router.urls))
]