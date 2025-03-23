from django.template.loader import render_to_string

def get_stylized_welcome_email(user):
    """
    Genera el contenido del correo de bienvenida usando plantillas.
    Devuelve: (subject, plain_message, html_message)
    """
    subject = "Bienvenido a Nuestra Plataforma"
    context = {'username': user.username}
    plain_message = render_to_string('emails/welcome.txt', context)
    html_message = render_to_string('emails/welcome.html', context)
    return subject, plain_message, html_message

def get_stylized_notification_email(user):
    """
    Genera el contenido del correo de notificación periódica usando plantillas.
    Devuelve: (subject, plain_message, html_message)
    """
    subject = "Recordatorio: Actualiza tus procesos"
    context = {'username': user.username}
    plain_message = render_to_string('emails/notification.txt', context)
    html_message = render_to_string('emails/notification.html', context)
    return subject, plain_message, html_message
