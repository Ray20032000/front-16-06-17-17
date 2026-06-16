import "./../../global.css";
import styles from "./../styles/Header.module.css";
import { Link } from "react-router-dom";

function Header() {

    return (
        <div className={styles.fundo}>
            <img
                className={styles.logo}
                src="/icon.png"
                alt="Logo ReportaAí"
            />
            <Link to="/Login" className={styles.botao}>Login</Link>
            <Link to="/Cadastro" className={styles.botao}>Cadastro</Link>
        </div>
    );
}

export default Header;
