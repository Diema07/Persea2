# usuarios/urls.py
from django.urls import path, include  # Importar include
from .views import get_csrf_token, GoogleDirectLoginView  # Importar la vista

urlpatterns = [
    path('auth/', include('allauth.urls')),  # Rutas de allauth
    path('get-csrf-token/', get_csrf_token, name='get_csrf_token'),  # Nueva ruta para obtener el token CSRF
    path('login-google/', GoogleDirectLoginView.as_view(), name='login-google'),
]