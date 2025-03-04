# notificaciones/utils.py
from django.core.mail import send_mail

def enviar_notificaciones(usuarios):
    for usuario in usuarios:
        subject = "¡Te extrañamos!"
        message = (
            f"Hola {usuario.username}, notamos que hace tiempo que no inicias sesión. "
            "¡Vuelve y descubre lo nuevo en nuestra aplicación!"
        )
        from_email = 'Persea712@gmail.com'  # Asegúrate de tener configurado el correo en settings.py
        recipient_list = [usuario.email]
        send_mail(subject, message, from_email, recipient_list)
