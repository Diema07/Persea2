from django.urls import path, include
from rest_framework import routers
from apps.produccion import views

# Configuración del enrutador de Django REST Framework
router = routers.DefaultRouter()

router.register(r'Cosecha', views.CosechaView, 'Cosecha')

urlpatterns = [

    path("api/v1/", include(router.urls))
]