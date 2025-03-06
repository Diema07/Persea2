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
        
        # Definir los grupos de campos
        grupo_riego = ['tipoRiego', 'fechaRiego']
        grupo_fertilizante = [
            'metodoAplicacionFertilizante',
            'tipoFertilizante',
            'nombreFertilizante',
            'cantidadFertilizante',
            'medidaFertilizante',
            'fechaFertilizante'
        ]
        
        # Función auxiliar que verifica si algún campo del grupo es inválido (None o cadena vacía)
        def grupo_incompleto(grupo):
            return any(representation.get(campo) in [None, ""] for campo in grupo)
        
        # Si el grupo de riego está incompleto, eliminar sus campos
        if grupo_incompleto(grupo_riego):
            for campo in grupo_riego:
                representation.pop(campo, None)
        
        # Si el grupo de fertilizante está incompleto, eliminar sus campos
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
            'necesidadArboles',
            'tipoTratamiento',
            'fechaAplicacionTratamiento',
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Definir los grupos:
        # Grupo 1: guadana
        grupo_guadana = ['guadana']
        # Grupo 2: el resto de los campos
        grupo_resto = ['necesidadArboles', 'tipoTratamiento', 'fechaAplicacionTratamiento']
        
        # Función auxiliar que verifica si algún campo del grupo es inválido (None o cadena vacía)
        def grupo_incompleto(grupo):
            return any(representation.get(campo) in [None, ""] for campo in grupo)
        
        # Si el grupo de guadana está incompleto, se elimina el campo
        if grupo_incompleto(grupo_guadana):
            for campo in grupo_guadana:
                representation.pop(campo, None)
        
        # Si el grupo del resto de campos está incompleto, se eliminan todos los campos del grupo
        if grupo_incompleto(grupo_resto):
            for campo in grupo_resto:
                representation.pop(campo, None)
        
        return representation

class PodaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poda
        fields = '__all__'