import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { Login } from './pages/Login';
import { PlantacionInicio } from './components/plantacion-inicio';
import { Taskform } from './pages/plantacion';
import { InicioPlantacion } from "./pages/inicio-plantacion";
import { PreparacionTerrenoPage } from './pages/preparacionTerreno';
import { SeleccionArbolesPage } from './pages/seleccionArboles';
import { RiegoFertilizacionPage} from './pages/riegoFertilizacion';
import { MantenimientoMonitoreoPage } from '../src/pages/mantenimientoMonitoreo';
import { PodaPage } from '../src/pages/poda';
import {GestionTareasPage} from '../src/pages/gestionTareas'
import { CosechaPage } from './pages/cosecha';
import { InformeCompletoPage } from './pages/informe';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/Login" />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/inicio-plantacion' element={<PlantacionInicio />} />
        <Route path="/plantacion" element={<Taskform />} />
        <Route path="/plantacion/inicio" element={<InicioPlantacion />} />
        <Route path="/gestionTareas/:plantacionId" element={<GestionTareasPage />} />
        <Route path="/preparacion/:plantacionId" element={<PreparacionTerrenoPage />} />
        <Route path="/seleccion-arboles/:plantacionId" element={<SeleccionArbolesPage />} />
        <Route path="/riego-fertilizacion/:plantacionId" element={<RiegoFertilizacionPage />} />
        <Route path="/mantenimiento-monitoreo/:plantacionId" element={<MantenimientoMonitoreoPage />} />
        <Route path="/poda/:plantacionId" element={<PodaPage />} />
        <Route path="/cosecha/:plantacionId" element={<CosechaPage />} />
        <Route path="/informe-completo/:plantacionId" element={<InformeCompletoPage />} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;