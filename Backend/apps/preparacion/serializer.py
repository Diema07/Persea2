from rest_framework import serializers
from .models import PreparacionTerreno, SeleccionArboles

class PreparacionTerrenoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreparacionTerreno
        fields = '__all__'


class SeleccionArbolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeleccionArboles
        fields = '__all__'
