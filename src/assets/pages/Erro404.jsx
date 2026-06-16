import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/Erro404.module.css";

function Erro404() {
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <div className={styles.countainer}>
                <h1>Ops!</h1>
                <h2>Página não encontrada</h2>
                <h3>Erro</h3>
                <img src="/erro.png" alt="Logo de erro" />
                <button className={styles.buttonn} onClick={() => navigate(-1)}>
                    Voltar
                </button>
            </div>
            <Footer />
        </div>);
}
export default Erro404;