import "./../../global.css";
import styles from "./../styles/Home.module.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
    return (
        <div>
            <Header />

            <img className={styles.fundo} src="/background.png" alt="Background ReportaAí" />
            <img className={styles.fundoMobile} src="/fundomobile.png" alt="Background ReportaAí" />

            <div className={styles.quadro}>
                <div className={styles.quadrin}>
                    <h3 className={styles.bemvindo}>Bem-vindo ao ReportaAí!</h3>
                    <br/><br/>

                    <img className={styles.check} src="/check.png" alt="check" />
                    <p className={styles.texto}>Sistema de chamados de manutenção escolar</p>
                    <br/>
                    <img className={styles.check} src="/check.png" alt="check" />
                    <p className={styles.texto}>Relate problemas em equipamentos e salas</p>
                    <br/>
                    <img className={styles.check} src="/check.png" alt="check" />
                    <p className={styles.texto}>Envie o chamado para a manutenção</p>
                    <br/>
                    <img className={styles.check} src="/check.png" alt="check" />
                    <p className={styles.texto}>Acompanhe o andamento do conserto</p>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;