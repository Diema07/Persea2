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
        del usuario autenticado. Además, si se pasa 'plantacionId' en
        los parámetros de la query, se filtra por ese identificador.
        """
        if self.request.user.is_authenticated:
            queryset = Cosecha.objects.filter(
                idPlantacion__idUsuario=self.request.user
            )
            plantacion_id = self.request.query_params.get('plantacionId')
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return Cosecha.objects.none()

    def create(self, request, *args, **kwargs):
        """
        Crea una nueva cosecha. La fecha de la cosecha se asigna automáticamente
        mediante 'auto_now_add' en el modelo, por lo que no es necesario manipular
        este campo en la vista.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
