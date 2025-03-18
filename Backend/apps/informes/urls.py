from django.urls import path, include
from rest_framework import routers
from .views import InformeCompletoView, PlantacionesCompletasCosechaRecienteView

router = routers.DefaultRouter()
router.register(r'plantaciones-cosecha-reciente', PlantacionesCompletasCosechaRecienteView, basename='plantaciones-cosecha-reciente')

urlpatterns = [
    path('informe-completo/<int:plantacion_id>/', InformeCompletoView.as_view(), name='informe_completo'),
    path('', include(router.urls)),
]
