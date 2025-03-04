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
        """
        Sobrescribe el método create para asignar la fecha actual
        a los campos de tipo DateField si vienen en request.data.
        """
        data = request.data.copy()

        # Campos DateField en RiegoFertilizacion: fechaRiego, fechaFertilizante
        if 'fechaRiego' in data:
            data['fechaRiego'] = timezone.now().date()
        if 'fechaFertilizante' in data:
            data['fechaFertilizante'] = timezone.now().date()

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
            print(f"Plantacion ID recibido en backend: {plantacion_id}")
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return MantenimientoMonitoreo.objects.none()
    #print(MantenimientoMonitoreo.objects.filter(idPlantacion__id=3).values())

    def create(self, request, *args, **kwargs):
        """
        Sobrescribe el método create para asignar la fecha actual
        a los campos de tipo DateField si vienen en request.data.
        """
        data = request.data.copy()

        # Campos DateField: guadaña, fechaAplicacionTratamiento
        if 'guadana' in data:
            data['guadana'] = timezone.now().date()
        if 'fechaAplicacionTratamiento' in data:
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
        """
        Sobrescribe el método create para asignar la fecha actual
        a los campos de tipo DateField si vienen en request.data.
        """
        data = request.data.copy()

        # Campo DateField en Poda: fechaPoda
        if 'fechaPoda' in data:
            data['fechaPoda'] = timezone.now().date()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    