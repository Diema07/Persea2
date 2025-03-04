# apps/preparacion/views.py

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .serializer import PreparacionTerrenoSerializer, SeleccionArbolesSerializer
from .models import PreparacionTerreno, SeleccionArboles

class PreparacionTerrenoView(viewsets.ModelViewSet):
    serializer_class = PreparacionTerrenoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Devuelve solo los registros vinculados a las plantaciones del usuario autenticado.
        if self.request.user.is_authenticated:
            queryset = PreparacionTerreno.objects.filter(idPlantacion__idUsuario=self.request.user)

            # Filtrar por el ID de la plantación si está presente en los parámetros
            plantacion_id = self.request.query_params.get('plantacionId', None)
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)

            return queryset
        return PreparacionTerreno.objects.none()


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Solo los campos de tipo DateField se reemplazan por la fecha actual
        if 'limpiezaTerreno' in data:
            data['limpiezaTerreno'] = timezone.now().date()
        if 'analisisSuelo' in data:
            data['analisisSuelo'] = timezone.now().date()
        if 'correcionSuelo' in data:
            data['correcionSuelo'] = timezone.now().date()
        if 'labranza' in data:
            data['labranza'] = timezone.now().date()
        # 'delimitacionParcela' es un FloatField; se conserva el valor enviado por el usuario.

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class SeleccionArbolesView(viewsets.ModelViewSet):
    serializer_class = SeleccionArbolesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Devuelve solo los registros vinculados a las plantaciones del usuario autenticado.
        if self.request.user.is_authenticated:
            queryset = SeleccionArboles.objects.filter(idPlantacion__idUsuario=self.request.user)

            # Filtrar por el ID de la plantación si está presente en los parámetros
            plantacion_id = self.request.query_params.get('plantacionId', None)
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)

            return queryset
        return SeleccionArboles.objects.none()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Solo los campos de tipo DateField se reemplazan por la fecha actual
        if 'preparacionColinos' in data:
            data['preparacionColinos'] = timezone.now().date()
        if 'excavacionHoyos' in data:
            data['excavacionHoyos'] = timezone.now().date()
        if 'plantacion' in data:
            data['plantacion'] = timezone.now().date()
        # 'seleccionVariedades' es un CharField; se conserva el valor enviado por el usuario.

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)