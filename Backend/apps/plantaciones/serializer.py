from rest_framework import serializers
from .models import Plantacion

class PlantacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plantacion
        fields = ['id', 'nombreParcela', 'fechaPlantacion', 'estado', 'idUsuario','completado']
        read_only_fields = ['fechaPlantacion', 'estado', 'idUsuario']


class PlantacionEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plantacion
        fields = ['estado']