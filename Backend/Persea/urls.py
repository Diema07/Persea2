from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.middleware.csrf import get_token

# Vista para devolver el CSRF token
def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})

urlpatterns = [
    path("admin/", admin.site.urls),
    path('accounts/', include('allauth.urls')),  # Incluir las rutas de allauth
    path('api/csrf/', csrf_token_view, name='csrf_token'),  # Ruta para obtener el token CSRF



    path('api/usuarios/', include('apps.usuarios.urls')),  # Incluir rutas de la app usuarios
    path('plantaciones/', include('apps.plantaciones.urls')), #Incluir rutas de la app plantaciones
    path('produccion/', include('apps.produccion.urls')),  # Incluir rutas de la app produccion
    path('preparacion/', include('apps.preparacion.urls')),  # Incluir rutas de la app preparacion
    path('mantenimiento/', include('apps.mantenimiento.urls')),  # Incluir rutas de la app mantenimiento
    path('informes/', include('apps.informes.urls'))  # Incluir rutas de la app informes
]

