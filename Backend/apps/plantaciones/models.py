from django.db import models
from django.contrib.auth.models import User

class Plantacion(models.Model):
    ESTADO_CHOICES = [
        ('ACTIVA', 'Activa'),
        ('INACTIVA', 'Inactiva'),
        ('COMPLETA', 'Completa'),
    ]

    nombreParcela = models.CharField(max_length=50)
    fechaPlantacion = models.DateField(auto_now_add=True)  # Fecha automática
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='ACTIVA')  
    idUsuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombreParcela} ({self.get_estado_display()})"
