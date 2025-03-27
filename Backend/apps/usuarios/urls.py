# usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import get_csrf_token, GoogleDirectLoginView, ProfileImageView

router = DefaultRouter()
router.register(r'imagenPerfil', ProfileImageView, basename='imagenPerfil')

urlpatterns = [
    path('auth/', include('allauth.urls')),  # Rutas de allauth
    path('get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('login-google/', GoogleDirectLoginView.as_view(), name='login-google'),
    path('', include(router.urls)),
]
