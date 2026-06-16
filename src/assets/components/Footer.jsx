import styles from "./../styles/Footer.module.css";

function Footer() {
    return (
        <footer className={styles.fundo}>
            <div className={styles.topo}>

                <div className={styles.coluna}>
                    <h3 className={styles.titulo}>CONTATO</h3>
                    <p className={styles.texto}>
                        Email: reporta.ai@gmail.com
                    </p>
                </div>

                <div className={`${styles.coluna} ${styles.colunaSobre}`}>
                    <h3 className={styles.titulo}>SOBRE O SISTEMA</h3>

                    <p className={styles.texto}>
                        O ReportaAí é uma plataforma desenvolvida para facilitar o registro e acompanhamento
                        de chamados técnicos em ambientes escolares, garantindo mais organização e agilidade
                        na resolução de problemas.
                    </p>
                </div>

                {/* DIREITA */}
                <div className={styles.direita}>

                    <img
                        className={styles.logo}
                        src="/icon.png"
                        alt="Logo ReportaAí"
                    />

                    <div className={styles.baixo}>
                        <p>Política de Privacidade | Termos de uso</p>
                        <p>© 2026 ReportaAí – Todos os direitos reservados</p>
                    </div>

                </div>

            </div>
        </footer>
    );
}

export default Footer;