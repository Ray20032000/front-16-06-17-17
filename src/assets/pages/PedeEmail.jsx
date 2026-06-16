import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/PedeEmail.module.css";

function PedeEmail() {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function enviarCodigo(e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("email", email);

            const resposta = await fetch("http://localhost:5000/reenviar_codigo", {
                method: "POST",
                body: formData
            });
            const data = await resposta.json();


            formData.append("email", email);

            if (resposta.ok) {
                localStorage.setItem("email_recuperacao", email);
                navigate("/Confirmar");
            } else {
                setErro(data.erro);
            }
        } catch (err) {
            setErro("Erro ao conectar com a API");
        }
    }

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.titulo}>Qual é o seu email?</h1>

                    <form className={styles.formulario} onSubmit={enviarCodigo}>
                        <div className={styles.campo}>
                            <label>Email:</label>
                            <input
                                type="email"
                                placeholder="Digite o email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {erro && <p className={styles.erro}>{erro}</p>}

                        <button type="submit" className={styles.botao}>
                            Enviar o código de verificação
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PedeEmail;