import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from "./../styles/Confirmar.module.css";

function CodigoTrocaSenha() {
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const navigate = useNavigate();

    async function confirmarCodigo(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        const email = localStorage.getItem("email_recuperacao");

        if (!email) {
            setErro("Sessão expirada. Solicite o código novamente.");
            return;
        }

        try {
            const resposta = await fetch("http://127.0.0.1:5000/redefinir_senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    codigo: codigo,
                    nova_senha: novaSenha
                })
            });

            const data = await resposta.json();

            if (resposta.ok) {
                setSucesso("Senha alterada com sucesso!");
                localStorage.removeItem("email_recuperacao");
                setTimeout(() => navigate("/Login"), 2000);
            } else {
                setErro(data.erro || "Erro ao redefinir senha.");
            }
        } catch (err) {
            setErro("Erro ao conectar com a API.");
        }
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <form className={styles.formulario} onSubmit={confirmarCodigo}>
                    <h1 className={styles.titulo}>Redefinir senha</h1>
                    <p>Enviamos um e-mail com o código de verificação</p>

                    <div className={styles.campo}>
                        <label>Código</label>
                        <input
                            className={styles.inputin}
                            placeholder="Digite o código"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Nova senha</label>
                        <input
                            className={styles.inputin}
                            type="password"
                            placeholder="Digite a nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                        />
                    </div>

                    {erro && <p style={{ color: "red" }}>{erro}</p>}
                    {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

                    <button className={styles.buttonn} type="submit">
                        Confirmar
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default CodigoTrocaSenha;