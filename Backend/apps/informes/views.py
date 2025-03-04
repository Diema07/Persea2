# apps/informes/views.py

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from weasyprint import HTML

from apps.plantaciones.models import Plantacion
from apps.preparacion.models import PreparacionTerreno, SeleccionArboles
from apps.mantenimiento.models import RiegoFertilizacion,MantenimientoMonitoreo,Poda
from apps.produccion.models import Cosecha


class InformeCompletoView(APIView):
    """
    Vista única:
    - GET /informes/api/v1/informe-completo/<plantacion_id>/  -> JSON
    - GET /informes/api/v1/informe-completo/<plantacion_id>/?formato=pdf -> PDF
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, plantacion_id):
        # 1. Verificar que la plantación pertenece al usuario
        plantacion = get_object_or_404(
            Plantacion,
            id=plantacion_id,
            idUsuario=request.user
        )

        # 2. Consultar cada modelo relacionado
        preparaciones = PreparacionTerreno.objects.filter(idPlantacion=plantacion)
        selecciones = SeleccionArboles.objects.filter(idPlantacion=plantacion)
        riegos = RiegoFertilizacion.objects.filter(idPlantacion=plantacion)
        mantenimientos = MantenimientoMonitoreo.objects.filter(idPlantacion=plantacion)
        podas = Poda.objects.filter(idPlantacion=plantacion)
        cosechas = Cosecha.objects.filter(idPlantacion=plantacion)

        # 3. Verificar parámetro "formato"
        formato = request.query_params.get('formato', 'json').lower()

        if formato == 'pdf':
            # 4. Generar PDF con WeasyPrint
            # Crea un contexto para el template
            context = {
                "plantacion": plantacion,
                "preparaciones": preparaciones,
                "selecciones": selecciones,
                "riegos": riegos,
                "mantenimientos": mantenimientos,
                "podas": podas,
                "cosechas": cosechas,
            }

            # Renderiza el template HTML (debes crearlo en templates/informes/informe_completo.html)
            html_string = render_to_string('informes/informe_completo.html', context)

            # Convierte HTML a PDF
            pdf_file = HTML(string=html_string).write_pdf()

            # Retorna el PDF como archivo descargable
            response = HttpResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename=\"informe_plantacion_{plantacion_id}.pdf\"'
            return response

        else:
            # 5. Retorna JSON
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
                "riegos": [
                    {
                        "id": r.id,
                        "tipoRiego": r.tipoRiego,
                        "fechaRiego": str(r.fechaRiego),
                        "tipoFertilizante": r.tipoFertilizante,
                        "nombreFertilizante": r.nombreFertilizante,
                        "cantidadFertilizante": str(r.cantidadFertilizante),
                        "medidaFertilizante": r.medidaFertilizante,
                        "fechaFertilizante": str(r.fechaFertilizante),
                    }
                    for r in riegos
                ],
                "mantenimientos": [
                    {
                        "id": m.id,
                        "guadana": str(m.guadana),
                        "necesidadArboles": m.necesidadArboles,
                        "tipoTratamiento": m.tipoTratamiento,
                        "fechaAplicacionTratamiento": str(m.fechaAplicacionTratamiento),
                    }
                    for m in mantenimientos
                ],
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
                        "cantidadCosechada": str(c.cantidadCosechada),
                        "kilosCalidadExportacion": str(c.kilosCalidadExportacion),
                        "kilosCalidadNacional": str(c.kilosCalidadNacional),
                        "kilosCalidadIndustrial": str(c.kilosCalidadIndustrial),
                    }
                    for c in cosechas
                ]
            }

            return Response(data)
