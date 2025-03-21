# usuarios/views.py
from django.http import JsonResponse
from django.middleware.csrf import get_token
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.views import OAuth2LoginView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.models import SocialAccount

def get_csrf_token(request):
    """
    Vista para obtener el token CSRF.
    """
    token = get_token(request)
    return JsonResponse({'csrfToken': token})



class GoogleDirectLoginView(OAuth2LoginView):
    adapter_class = GoogleOAuth2Adapter
    def dispatch(self, request, *args, **kwargs):
        # Inicializa el adapter antes de continuar
        self.adapter = self.adapter_class(request)
        return super().dispatch(request, *args, **kwargs)


class ProfileImageView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Retorna la URL de la foto de perfil almacenada en el extra_data de SocialAccount.
        """
        try:
            social_account = SocialAccount.objects.get(user=request.user, provider='google')
            profile_picture = social_account.extra_data.get('picture')
        except SocialAccount.DoesNotExist:
            profile_picture = None
        return Response({'profile_picture': profile_picture})
