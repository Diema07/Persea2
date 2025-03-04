from django.contrib import admin
from .models import RiegoFertilizacion, MantenimientoMonitoreo, Poda

# Register your models here.
admin.site.register(RiegoFertilizacion)
admin.site.register(MantenimientoMonitoreo)
admin.site.register(Poda)