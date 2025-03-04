from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

class UsuarioAdmin(UserAdmin):
    # Campos que se mostrarán en la lista de objetos
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined')
    # Campos por los que se puede buscar
    search_fields = ('username', 'email')
    # Opciones para filtrar en la lista
    list_filter = ('is_active', 'is_staff')
    # Ordenar los usuarios por ID
    ordering = ('id',)
    # Hacer campos solo de lectura, si es necesario
    readonly_fields = ('id',)

# Desregistrar el modelo User y volver a registrarlo con la clase personalizada
admin.site.unregister(User)
admin.site.register(User, UsuarioAdmin)
