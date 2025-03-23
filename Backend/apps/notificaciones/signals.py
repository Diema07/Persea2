from django.core.mail import send_mail
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from apps.notificaciones.email_templates import get_stylized_welcome_email

@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    if created:
        subject, plain_message, html_message = get_stylized_welcome_email(instance)
        send_mail(
            subject,
            plain_message,
            settings.EMAIL_HOST_USER,
            [instance.email],
            html_message=html_message,
            fail_silently=False,
        )
