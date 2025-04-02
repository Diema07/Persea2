from rest_framework import serializers
from .models import RiegoFertilizacion, MantenimientoMonitoreo, Poda

class RiegoFertilizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiegoFertilizacion
        fields = (
            'idPlantacion',
            'tipoRiego',
            'fechaRiego',
            'metodoAplicacionFertilizante',
            'tipoFertilizante',
            'nombreFertilizante',
            'cantidadFertilizante',
            'medidaFertilizante',
            'fechaFertilizante',
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        grupo_riego = ['tipoRiego', 'fechaRiego']
        grupo_fertilizante = [
            'metodoAplicacionFertilizante',
            'tipoFertilizante',
            'nombreFertilizante',
            'cantidadFertilizante',
            'medidaFertilizante',
            'fechaFertilizante'
        ]
        
        def grupo_incompleto(grupo):
            return any(representation.get(campo) in [None, ""] for campo in grupo)
        
        if grupo_incompleto(grupo_riego):
            for campo in grupo_riego:
                representation.pop(campo, None)
        
        if grupo_incompleto(grupo_fertilizante):
            for campo in grupo_fertilizante:
                representation.pop(campo, None)
        
        return representation

class MantenimientoMonitoreoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoMonitoreo
        fields = (
            'idPlantacion',
            'guadana',
            'metodoAplicacionFumigacion',
            'tipoTratamiento',
            'fechaAplicacionTratamiento',
            'nombreTratamiento',
            'cantidadTratamiento',
            'medidaTratamiento',
            'observacion'
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        grupo_guadana = ['guadana']
        grupo_resto = ['metodoAplicacionFumigacion', 'tipoTratamiento', 'fechaAplicacionTratamiento','nombreTratamiento','cantidadTratamiento','medidaTratamiento','observacion']
        
        def grupo_incompleto(grupo):
            return any(representation.get(campo) in [None, ""] for campo in grupo)
        
        if grupo_incompleto(grupo_guadana):
            for campo in grupo_guadana:
                representation.pop(campo, None)
        
        if grupo_incompleto(grupo_resto):
            for campo in grupo_resto:
                representation.pop(campo, None)
        
        return representation

class PodaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poda
        fields = '__all__'