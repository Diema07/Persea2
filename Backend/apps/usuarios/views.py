# usuarios/views.py
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    """
    Vista para obtener el token CSRF.
    """
    token = get_token(request)
    return JsonResponse({'csrfToken': token})