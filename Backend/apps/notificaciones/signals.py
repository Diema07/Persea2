# apps/notificaciones/signals.py
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail

@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    if created:
        subject = "Bienvenido a Nuestra Plataforma"
        message = f"Hola {instance.username}, ¡gracias por registrarte en nuestra plataforma!"
        from_email = settings.EMAIL_HOST_USER  # Debe estar definido en settings.py
        recipient_list = [instance.email]
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
