from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cosecha
from .serializer import CosechaSerializer

class CosechaView(viewsets.ModelViewSet):
    serializer_class = CosechaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Devuelve solo las cosechas vinculadas a las plantaciones
        del usuario autenticado. Filtra también por plantacionId
        si está presente en la query.
        """
        if self.request.user.is_authenticated:
            queryset = Cosecha.objects.filter(
                idPlantacion__idUsuario=self.request.user
            )
            plantacion_id = self.request.query_params.get('plantacionId', None)
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return Cosecha.objects.none()

    def create(self, request, *args, **kwargs):
        """
        Sobrescribe el método create para asignar la fecha actual
        al campo 'fechaCosecha' si viene en request.data.
        """
        data = request.data.copy()

        # Campo DateField en Cosecha: fechaCosecha
        if 'fechaCosecha' in data:
            data['fechaCosecha'] = timezone.now().date()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
