import { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/EsqueciSenha.module.css";
import { useNavigate } from "react-router-dom";
import CodigoTrocaSenha from "./CodigoTrocaSenha.jsx";

function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function CodigoTrocaSenha(e) {
        e.preventDefault();
        setErro("");
        setMensagem("");

        try {
            const resp = await fetch("http://localhost:5000/solicitar_recuperacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await resp.json();

            if (resp.ok) {
                setMensagem("Código enviado! Verifique seu e-mail.");
                localStorage.setItem("email_recuperacao", email);
                setTimeout(() => navigate("/CodigoTrocaSenha"), 2000);
            } else {
                setErro(data.erro || "Erro ao enviar código.");
            }
        } catch {
            setErro("Erro ao conectar com a API.");
        }
    }

    return (
        <div>
            <Header />
            <div className={styles.countainer}>
                <form onSubmit={CodigoTrocaSenha} className={styles.formulinho}>
                    <h1 className={styles.titulo}>Esqueci minha senha</h1>

                    <div className={styles.campo}>
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {mensagem && <p className={styles.sucesso}>{mensagem}</p>}
                    {erro && <p className={styles.erro}>{erro}</p>}

                    <div className={styles.botao}>
                        <button className={styles.buttonn} type="submit">
                            Enviar código de verificação
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default EsqueciSenha;