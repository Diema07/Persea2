from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import RiegoFertilizacion, MantenimientoMonitoreo, Poda
from .serializer import (
    RiegoFertilizacionSerializer,
    MantenimientoMonitoreoSerializer,
    PodaSerializer
)

class RiegoFertilizacionView(viewsets.ModelViewSet):
    serializer_class = RiegoFertilizacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = RiegoFertilizacion.objects.filter(
                idPlantacion__idUsuario=self.request.user
            )
            plantacion_id = self.request.query_params.get('plantacionId', None)
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return RiegoFertilizacion.objects.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        if 'guadana' in data and data['guadana'] is not None:
            data['guadana'] = timezone.now().date()

        if 'fechaAplicacionTratamiento' in data and data['fechaAplicacionTratamiento'] is not None:
            data['fechaAplicacionTratamiento'] = timezone.now().date()


        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MantenimientoMonitoreoView(viewsets.ModelViewSet):
    serializer_class = MantenimientoMonitoreoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = MantenimientoMonitoreo.objects.filter(
                idPlantacion__idUsuario=self.request.user
            )
            plantacion_id = self.request.query_params.get('plantacionId', None)
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return MantenimientoMonitoreo.objects.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        print(request.data)

        if 'fechaAplicacionTratamiento' in data and not data['fechaAplicacionTratamiento']:
            data['fechaAplicacionTratamiento'] = timezone.now().date()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PodaView(viewsets.ModelViewSet):
    serializer_class = PodaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = Poda.objects.filter(
                idPlantacion__idUsuario=self.request.user
            )
            plantacion_id = self.request.query_params.get('plantacionId', None)
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return Poda.objects.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        if 'fechaPoda' not in data or not data['fechaPoda']:
            data['fechaPoda'] = timezone.now().date()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)