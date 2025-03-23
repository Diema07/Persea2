import os
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from django.conf import settings

logger = logging.getLogger('apscheduler')

def send_periodic_notifications():
    from django.core.mail import send_mail
    from django.contrib.auth.models import User
    from django.utils import timezone
    users = User.objects.all()
    for user in users:
        send_mail(
            'Recordatorio',
            'Recuerda revisar la plataforma para actualizar tus procesos.',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
    logger.info(f'Notificaciones enviadas a {users.count()} usuarios a las {timezone.now()}')

def start_scheduler():
    # Evita iniciar el scheduler en procesos secundarios (por ejemplo, el proceso de autoreload de runserver)
    if os.environ.get('RUN_MAIN') != 'true':
        return

    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    
    # Opción 1: Notificaciones cada 2 minutos
    scheduler.add_job(
        send_periodic_notifications,
        trigger='interval',
        minutes=2,
        id="send_every_2_minutes",
        replace_existing=True,
        max_instances=1,  # Evita ejecuciones paralelas
        misfire_grace_time=60  # Tiempo de gracia en segundos
    )
    
    # Opción 2: Notificaciones a las 8:00 AM cada día (comenta esta sección si usas la opción 1)
    # scheduler.add_job(
    #     send_periodic_notifications,
    #     trigger='cron',
    #     hour=8,
    #     minute=0,
    #     id="send_daily_8am",
    #     replace_existing=True,
    #     max_instances=1,
    #     misfire_grace_time=300  # Tiempo de gracia de 5 minutos
    # )
    
    register_events(scheduler)
    scheduler.start()
    logger.info("Scheduler started!")
