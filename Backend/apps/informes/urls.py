from django.urls import path
from rest_framework import routers
from .views import InformeCompletoView

router = routers.DefaultRouter()

urlpatterns = [
    path('informe-completo/<int:plantacion_id>/', InformeCompletoView.as_view(), name='informe_completo'),
]


