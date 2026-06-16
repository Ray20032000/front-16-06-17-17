import Footer from "../components/Footer.jsx";
import styles from "../styles/DashboardAdmin.module.css";
import { Link } from "react-router-dom";
import HeaderLogado from "../components/Headerlogado.jsx";
import { useEffect } from "react";
import TabelaChamado from "../components/TabelaChamado";

function DashboardAdmin() {

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const logado = localStorage.getItem("logado");

        if (!logado || usuario.tipo !== "ADMIN") {
            navigate("/Login", { replace: true });
        }
    }, []);


    return (
        <div>
            <HeaderLogado />
            <div >
                <h1 className={styles.bemvindo}>Bem vindo de volta Admin!</h1>

                <Link to={"/AddStatus"}>
                    <button className={styles.buttonn}>
                        + Add Status
                    </button>
                </Link>
                <Link to={"/VisualizarUsuarios"}>
                    <button className={styles.buttonn}>
                        Visualizar Usuários
                    </button>
                </Link>

                <br/><br/>
                <h3 className={styles.chamados}>Chamados</h3>

                <TabelaChamado/>

            </div>
            <Footer />
        </div>
    );
}

export default DashboardAdmin;