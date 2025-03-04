from rest_framework import serializers
from .models import Plantacion

class PlantacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plantacion
        fields = ['id', 'nombreParcela', 'fechaPlantacion', 'estado', 'idUsuario']
        read_only_fields = ['fechaPlantacion', 'estado', 'idUsuario']
