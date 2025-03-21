from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from pathlib import Path
import environ
import os

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

class Command(BaseCommand):
    help = 'Envía correos periódicos a los usuarios.'

    def handle(self, *args, **options):
        usuarios = User.objects.all()  # Puedes filtrar o ajustar según tus necesidades
        for usuario in usuarios:
            asunto = '🥑 Gestiona tus Plantaciones 🥑'
            
            # Cuerpo del mensaje en texto plano
            mensaje = 'Recuerda que para tener una gran gestion de tus plantaciones, tienes que guardar tus procesos diariamente.'

            # Cuerpo del mensaje en HTML
            mensaje_html = f"""
            <html>
            <body>
                <h1 style="color: #4CAF50;">🥑 Gestiona tus Plantaciones 🥑</h1>
                <p>Hola, {usuario.username}.</p>
                <p>Recuerda que para tener una gran gestión de tus plantaciones, es importante registrar tus procesos a diario.</p>
                <p style="color: #888;">¡Te esperamos en la plataforma!</p>
                <hr>
                <footer>
                    <p>Este es un correo automático. No respondas a este mensaje.</p>
                </footer>
            </body>
            </html>
            """
            
            # Envío del correo con HTML
            send_mail(
                asunto,
                mensaje,  # Enviar también el mensaje en texto plano por compatibilidad
                env('EMAIL_HOST_USER'),  # EMAIL_HOST_USER
                [usuario.email],
                fail_silently=False,
                html_message=mensaje_html  # Añadimos el mensaje HTML
            )
        
        self.stdout.write(f'Notificaciones enviadas a {usuarios.count()} usuarios a las {timezone.now()}')
