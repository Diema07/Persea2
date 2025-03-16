import pdfcrowd
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.plantaciones.models import Plantacion
from apps.preparacion.models import PreparacionTerreno, SeleccionArboles
from apps.mantenimiento.models import RiegoFertilizacion, MantenimientoMonitoreo, Poda
from apps.produccion.models import Cosecha
from apps.plantaciones.serializer import PlantacionSerializer
from apps.produccion.serializer import CosechaSerializer
from django.db.models import Max


class PlantacionesCompletasCosechaRecienteView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        # Filtrar las plantaciones con estado "COMPLETA" y que pertenezcan al usuario autenticado
        plantaciones = Plantacion.objects.filter(estado="COMPLETA", idUsuario=request.user)
        
        resultado = []
        for plantacion in plantaciones:
            # Se serializa la plantación usando el PlantacionSerializer
            plantacion_data = PlantacionSerializer(plantacion).data
            
            # Se obtiene la fecha de cosecha más reciente para la plantación actual
            fecha_reciente = Cosecha.objects.filter(idPlantacion=plantacion) \
                .aggregate(fechaCosecha_max=Max('fechaCosecha'))['fechaCosecha_max']
            
            # Se añade el campo de la fecha de cosecha a la serialización de la plantación
            plantacion_data['fechaCosecha'] = fecha_reciente
            resultado.append(plantacion_data)
        
        return Response(resultado)

class InformeCompletoView(APIView):
    """
    Vista única:
    - GET /informes/api/v1/informe-completo/<plantacion_id>/?formato=json  -> JSON
    - GET /informes/api/v1/informe-completo/<plantacion_id>/?formato=pdf   -> PDF
    - GET /informes/api/v1/informe-completo/<plantacion_id>/?formato=html  -> HTML (para incrustar en la página)
    """
    permission_classes = [IsAuthenticated]

    def process_riego(self, r):
        rep = {"id": r.id}
        # Grupo Riego
        if r.tipoRiego not in [None, ""] and r.fechaRiego not in [None, ""]:
            rep["tipoRiego"] = r.tipoRiego
            rep["fechaRiego"] = str(r.fechaRiego)
        # Grupo Fertilización
        if (r.metodoAplicacionFertilizante not in [None, ""] and
            r.tipoFertilizante not in [None, ""] and
            r.nombreFertilizante not in [None, ""] and
            r.cantidadFertilizante not in [None, ""] and
            r.medidaFertilizante not in [None, ""] and
            r.fechaFertilizante not in [None, ""]):
            rep["metodoAplicacionFertilizante"] = r.metodoAplicacionFertilizante
            rep["tipoFertilizante"] = r.tipoFertilizante
            rep["nombreFertilizante"] = r.nombreFertilizante
            rep["cantidadFertilizante"] = str(r.cantidadFertilizante)
            rep["medidaFertilizante"] = r.medidaFertilizante
            rep["fechaFertilizante"] = str(r.fechaFertilizante)
        return rep

    def process_mantenimiento(self, m):
        rep = {"id": m.id}
        # Grupo Guadana
        if m.guadana not in [None, ""]:
            rep["guadana"] = str(m.guadana)
        # Grupo Mantenimiento y Monitoreo
        if (m.metodoAplicacionFumigacion not in [None, ""] and
            m.tipoTratamiento not in [None, ""] and
            m.fechaAplicacionTratamiento not in [None, ""] and
            m.nombreTratamiento not in [None, ""] and
            m.cantidadTratamiento not in [None, ""] and
            m.medidaTratamiento not in [None, ""]):
            rep["metodoAplicacionFumigacion"] = m.metodoAplicacionFumigacion
            rep["tipoTratamiento"] = m.tipoTratamiento
            rep["fechaAplicacionTratamiento"] = str(m.fechaAplicacionTratamiento)
            rep["nombreTratamiento"] = m.nombreTratamiento
            rep["cantidadTratamiento"] = str(m.cantidadTratamiento)
            rep["medidaTratamiento"] = m.medidaTratamiento
        return rep

    def get(self, request, plantacion_id):
        plantacion = get_object_or_404(
            Plantacion,
            id=plantacion_id,
            idUsuario=request.user
        )

        preparaciones = PreparacionTerreno.objects.filter(idPlantacion=plantacion)
        selecciones = SeleccionArboles.objects.filter(idPlantacion=plantacion)
        riegos = RiegoFertilizacion.objects.filter(idPlantacion=plantacion)
        mantenimientos = MantenimientoMonitoreo.objects.filter(idPlantacion=plantacion)
        podas = Poda.objects.filter(idPlantacion=plantacion)
        cosechas = Cosecha.objects.filter(idPlantacion=plantacion)

        processed_riegos = [self.process_riego(r) for r in riegos]
        processed_mantenimientos = [self.process_mantenimiento(m) for m in mantenimientos]

        # Separar en grupos
        riego_group = [r for r in processed_riegos if "tipoRiego" in r and "fechaRiego" in r]
        fertilizacion_group = [r for r in processed_riegos if "metodoAplicacionFertilizante" in r]
        guadana_group = [m for m in processed_mantenimientos if "guadana" in m]
        mant_group = [m for m in processed_mantenimientos if "metodoAplicacionFumigacion" in m]

        formato = request.query_params.get('formato', 'json').lower()

        if formato == 'pdf':
            context = {
                "plantacion": plantacion,
                "preparaciones": preparaciones,
                "selecciones": selecciones,
                "riego_group": riego_group,
                "fertilizacion_group": fertilizacion_group,
                "guadana_group": guadana_group,
                "mant_group": mant_group,
                "podas": podas,
                "cosechas": cosechas,
            }
            html_string = render_to_string('informe_completo.html', context)
            try:
                client = pdfcrowd.HtmlToPdfClient("Persea", "b287580fca9c1ab48cfd4398d2bf20a5")
                pdf_content = client.convertString(html_string)
            except pdfcrowd.Error as error:
                return HttpResponse("Error al generar el PDF: " + str(error), status=500)
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="informe_plantacion_{plantacion_id}.pdf"'
            return response

        elif formato == 'html':
            context = {
                "plantacion": plantacion,
                "preparaciones": preparaciones,
                "selecciones": selecciones,
                "riego_group": riego_group,
                "fertilizacion_group": fertilizacion_group,
                "guadana_group": guadana_group,
                "mant_group": mant_group,
                "podas": podas,
                "cosechas": cosechas,
            }
            html_string = render_to_string('informe_completo.html', context)
            return HttpResponse(html_string, content_type='text/html')

        else:
            data = {
                "plantacion": {
                    "id": plantacion.id,
                    "nombreParcela": plantacion.nombreParcela,
                },
                "preparaciones": [
                    {
                        "id": p.id,
                        "limpiezaTerreno": str(p.limpiezaTerreno),
                        "analisisSuelo": str(p.analisisSuelo),
                        "correcionSuelo": str(p.correcionSuelo),
                        "labranza": str(p.labranza),
                        "delimitacionParcela": str(p.delimitacionParcela),
                    }
                    for p in preparaciones
                ],
                "selecciones": [
                    {
                        "id": s.id,
                        "seleccionVariedades": s.seleccionVariedades,
                        "preparacionColinos": str(s.preparacionColinos),
                        "excavacionHoyos": str(s.excavacionHoyos),
                        "plantacion": str(s.plantacion),
                    }
                    for s in selecciones
                ],
                "riegos": {
                    "riego": riego_group,
                    "fertilizacion": fertilizacion_group,
                },
                "mantenimientos": {
                    "guadana": guadana_group,
                    "mantenimiento": mant_group,
                },
                "podas": [{"id": pd.id, "tipoPoda": pd.tipoPoda} for pd in podas],
                "cosechas": [{"id": c.id, "fechaCosecha": str(c.fechaCosecha)} for c in cosechas],
            }
            return Response(data)
