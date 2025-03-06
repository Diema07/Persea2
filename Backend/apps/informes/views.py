import pdfcrowd
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.plantaciones.models import Plantacion
from apps.preparacion.models import PreparacionTerreno, SeleccionArboles
from apps.mantenimiento.models import RiegoFertilizacion, MantenimientoMonitoreo, Poda
from apps.produccion.models import Cosecha

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
        # Grupo Riego: se incluye solo si ambos campos están completos
        if r.tipoRiego not in [None, ""] and r.fechaRiego not in [None, ""]:
            rep["tipoRiego"] = r.tipoRiego
            rep["fechaRiego"] = str(r.fechaRiego)
        # Grupo Fertilización: se incluyen solo si TODOS los campos están completos
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
        # Grupo Guadaña
        if m.guadana not in [None, ""]:
            rep["guadana"] = str(m.guadana)
        # Grupo Mantenimiento y Monitoreo: se incluyen solo si TODOS los campos están completos
        if (m.necesidadArboles not in [None, ""] and
            m.tipoTratamiento not in [None, ""] and
            m.fechaAplicacionTratamiento not in [None, ""]):
            rep["necesidadArboles"] = m.necesidadArboles
            rep["tipoTratamiento"] = m.tipoTratamiento
            rep["fechaAplicacionTratamiento"] = str(m.fechaAplicacionTratamiento)
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
        fertilizacion_group = [r for r in processed_riegos if "metodoAplicacionFertilizante" in r and "tipoFertilizante" in r and "nombreFertilizante" in r and "cantidadFertilizante" in r and "medidaFertilizante" in r and "fechaFertilizante" in r]
        guadana_group = [m for m in processed_mantenimientos if "guadana" in m]
        mant_group = [m for m in processed_mantenimientos if "necesidadArboles" in m and "tipoTratamiento" in m and "fechaAplicacionTratamiento" in m]

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
            # Devolver el HTML renderizado para incrustarlo en la página
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
                "podas": [
                    {
                        "id": pd.id,
                        "tipoPoda": pd.tipoPoda,
                        "herramientasUsadas": pd.herramientasUsadas,
                        "tecnicasUsadas": pd.tecnicasUsadas,
                        "fechaPoda": str(pd.fechaPoda),
                    }
                    for pd in podas
                ],
                "cosechas": [
                    {
                        "id": c.id,
                        "fechaCosecha": str(c.fechaCosecha),
                        "cantidadAltaCalidad": str(c.cantidadAltaCalidad),
                        "cantidadMedianaCalidad": str(c.cantidadMedianaCalidad),
                        "cantidadBajaCalidad": str(c.cantidadBajaCalidad),
                    }
                    for c in cosechas
                ]
            }
            return Response(data)
