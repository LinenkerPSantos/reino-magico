import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Racas from './pages/Racas/Racas'
import Classes from './pages/Classes/Classes'
import Mecanicas from './pages/Mecanicas/Mecanicas'
import Historia from './pages/Historia/Historia'
import Magias from './pages/Magias/Magias'
import Equipamentos from './pages/Equipamentos/Equipamentos'
import Entidades from './pages/Entidades/Entidades'
import Aprimoramento from './pages/Aprimoramento/Aprimoramento'
import Sobre from './pages/Sobre/Sobre'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="racas" element={<Racas />} />
          <Route path="classes" element={<Classes />} />
          <Route path="equipamentos" element={<Equipamentos />} />
          <Route path="mecanicas" element={<Mecanicas />} />
          <Route path="historia" element={<Historia />} />
          <Route path="magias" element={<Magias />} />
          <Route path="entidades" element={<Entidades />} />
          <Route path="aprimoramento" element={<Aprimoramento />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
