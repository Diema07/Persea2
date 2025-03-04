from django.urls import path, include
from rest_framework import routers
from apps.informes import views
from .views import InformeCompletoView

router = routers.DefaultRouter()

urlpatterns = [
    path('informe-completo/<int:plantacion_id>/', InformeCompletoView.as_view(), name='informe_completo'),
]


