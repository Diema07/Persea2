# apps/plantaciones/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializer import PlantacionSerializer, PlantacionEstadoSerializer
from .models import Plantacion
from apps.preparacion.models import PreparacionTerreno, SeleccionArboles
from .signals import plantacion_completada


class PlantacionView(viewsets.ModelViewSet):
    serializer_class = PlantacionSerializer
    permission_classes = [IsAuthenticated]  # Se requiere autenticación

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Plantacion.objects.filter(idUsuario=self.request.user)
        return Plantacion.objects.none()  # No devuelve nada si no está autenticado


    def create(self, request, *args, **kwargs):
        # El usuario autenticado
        usuario = self.request.user

        # Verificar si el usuario está autenticado
        if not usuario.is_authenticated:
            return Response({"detail": "El usuario no está autenticado."}, status=status.HTTP_403_FORBIDDEN)

        # Crear el serializador con los datos del request
        serializer = PlantacionSerializer(data=self.request.data, context={'request': request})

        # Verificar si los datos son válidos
        if serializer.is_valid():
            # Guardar la plantación asignando el usuario autenticado
            serializer.save(idUsuario=usuario)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Si los datos no son válidos, devolver errores
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return PlantacionEstadoSerializer
        return PlantacionSerializer
    
    @action(detail=True, methods=['get'], url_path='estado-tareas')
    def estado_tareas(self, request, pk=None):
        print(f"Accediendo a estado-tareas para la plantación con pk={pk}")
        """
        GET /Plantacion/<pk>/estado-tareas/
        Retorna si las tareas de 'Preparación' y 'Selección' están completadas.
        """
        plantacion = self.get_object()  # Plantacion con pk=<pk>
        # Filtramos la tarea de PreparacionTerreno y SeleccionArboles
        preparacion = PreparacionTerreno.objects.filter(idPlantacion=plantacion).first()
        seleccion = SeleccionArboles.objects.filter(idPlantacion=plantacion).first()

        data = {
            "preparacion": preparacion.completado if preparacion else False,
            "seleccion": seleccion.completado if seleccion else False
        }
        return Response(data)
    
    @action(detail=True, methods=['post'], url_path='completar')
    def completar_plantacion(self, request, pk=None):
        # Obtener la plantación
        plantacion = self.get_object()
        # Actualizar el estado (esto podría hacerse aquí o en la señal)
        plantacion.estado = 'COMPLETA'
        plantacion.save()
        # Disparar la señal pasando la plantación completada
        plantacion_completada.send(sender=Plantacion, plantacion=plantacion)
        return Response({"message": "Plantación completada y nueva plantación creada."}, status=status.HTTP_200_OK)


class PlantacionFiltradaView(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlantacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Plantacion.objects.filter(idUsuario=self.request.user, estado='ACTIVA').order_by('-id')
        return Plantacion.objects.none()
    

   
class PlantacionesCompletasList(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlantacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Plantacion.objects.filter(estado="COMPLETA")
        return Plantacion.objects.none()