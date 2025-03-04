from rest_framework import serializers
from .models import RiegoFertilizacion, MantenimientoMonitoreo, Poda

class RiegoFertilizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiegoFertilizacion
        fields = '__all__'

class MantenimientoMonitoreoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoMonitoreo
        fields = '__all__'

class PodaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poda
        fields = '__all__'