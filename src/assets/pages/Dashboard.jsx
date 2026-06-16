import HeaderLogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect } from "react";
import TabelaChamado from "../components/TabelaChamado.jsx";


function Dashboard() {

    useEffect(() => {
        const logado = localStorage.getItem("logado");
        if (!logado) {
            navigate("/Login", { replace: true });
        }
    }, []);


    return (
        <div>
            <HeaderLogado/>

            <div>
                <TabelaChamado/>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;