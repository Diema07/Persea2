# usuarios/views.py
from django.http import JsonResponse
from django.middleware.csrf import get_token
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.views import OAuth2LoginView

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