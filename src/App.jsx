import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home.jsx";
import Login from "./assets/pages/Login.jsx";
import Cadastro from "./assets/pages/Cadastro.jsx";
import Erro404 from "./assets/pages/Erro404.jsx";
import EsqueciSenha from "./assets/pages/EsqueciSenha.jsx";
import Confirmar from "./assets/pages/Confirmar.jsx";
import DashboardAdmin from "./assets/pages/DashboardAdmin.jsx";
import VisualizarUsuarios from "./assets/pages/VisualizarUsuarios.jsx";
import Dashboard from "./assets/pages/Dashboard.jsx";
import AddStatus from "./assets/pages/AddStatus.jsx";
import CodigoTrocaSenha from "./assets/pages/CodigoTrocaSenha.jsx";
import NovoChamado from "./assets/pages/NovoChamado.jsx";
import DetalhesChamado from "./assets/pages/DetalhesChamado.jsx";
import AddProfessor from "./assets/pages/AddProfessor.jsx";
import AddAdmin from "./assets/pages/AddAdmin.jsx";
import PedeEmail from "./assets/pages/PedeEmail.jsx";
import Perfil from "./assets/pages/Perfil.jsx";
import EditarPerfil from "./assets/pages/EditarPerfil.jsx";
import EditarChamado from "./assets/pages/EditarChamado.jsx";
import EditarUsuario from "./assets/pages/EditarUsuario.jsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Cadastro" element={<Cadastro />} />
                <Route path="/*" element={<Erro404/>} />
                <Route path="/EsqueciSenha" element={<EsqueciSenha />} />
                <Route path="/Confirmar" element={<Confirmar />} />
                <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
                <Route path="/AddStatus" element={<AddStatus />} />
                <Route path="/VisualizarUsuarios" element={<VisualizarUsuarios />} />
                <Route path="/CodigoTrocaSenha" element={<CodigoTrocaSenha />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/NovoChamado" element={<NovoChamado />} />
                <Route path="/chamado/:id" element={<DetalhesChamado />} />
                <Route path="/AddProfessor" element={<AddProfessor />} />
                <Route path="/AddAdmin" element={<AddAdmin />} />
                <Route path="/PedeEmail" element={<PedeEmail/>} />
                <Route path={"/Perfil"} element={<Perfil />} />
                <Route path={"/EditarPerfil"} element={<EditarPerfil />} />
                <Route path={"/EditarChamado/:id"} element={<EditarChamado />} />
                <Route path="/admin/editar-usuario/:id_usuario" element={<EditarUsuario />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
