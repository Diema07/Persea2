<<<<<<< HEAD
=======
from django.utils import timezone
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
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
<<<<<<< HEAD
        del usuario autenticado. Además, si se pasa 'plantacionId' en
        los parámetros de la query, se filtra por ese identificador.
=======
        del usuario autenticado. Filtra también por plantacionId
        si está presente en la query.
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
        """
        if self.request.user.is_authenticated:
            queryset = Cosecha.objects.filter(
                idPlantacion__idUsuario=self.request.user
            )
<<<<<<< HEAD
            plantacion_id = self.request.query_params.get('plantacionId')
=======
            plantacion_id = self.request.query_params.get('plantacionId', None)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
            if plantacion_id:
                queryset = queryset.filter(idPlantacion__id=plantacion_id)
            return queryset
        return Cosecha.objects.none()

    def create(self, request, *args, **kwargs):
        """
<<<<<<< HEAD
        Crea una nueva cosecha. La fecha de la cosecha se asigna automáticamente
        mediante 'auto_now_add' en el modelo, por lo que no es necesario manipular
        este campo en la vista.
        """
        serializer = self.get_serializer(data=request.data)
=======
        Sobrescribe el método create para asignar la fecha actual
        al campo 'fechaCosecha' si viene en request.data.
        """
        data = request.data.copy()

        # Campo DateField en Cosecha: fechaCosecha
        if 'fechaCosecha' in data:
            data['fechaCosecha'] = timezone.now().date()

        serializer = self.get_serializer(data=data)
>>>>>>> b4347e1de8487fb47b221dd6fe939056af9c2ad7
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
