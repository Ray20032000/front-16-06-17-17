import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/RedefinirSenha.module.css";

function RedefinirSenha() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function redefinirSenha(e) {
        e.preventDefault();
        setErro("");
        setMensagem("");

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch("http://127.0.0.1:5000/redefinir_senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    codigo: codigo,
                    nova_senha: novaSenha,
                }),
            });

            const dados = await resposta.json();

            if (resposta.status === 200) {
                setMensagem(dados.mensagem || "Senha alterada com sucesso!");
                setTimeout(() => navigate("/login"), 2500);
            } else {
                setErro(dados.erro || "Erro ao redefinir a senha.");
            }
        } catch {
            setErro("Erro de conexão. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <form onSubmit={redefinirSenha} className={styles.formulario}>
                    <h1 className={styles.titulo}>Redefinir a senha</h1>

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

                    <div className={styles.campo}>
                        <label>Código de verificação:</label>
                        <input
                            type="text"
                            placeholder="Digite o código recebido por email"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            required
                            maxLength={6}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Senha:</label>
                        <input
                            type="password"
                            placeholder="Digite sua nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Confirme a senha:</label>
                        <input
                            type="password"
                            placeholder="Digite novamente sua senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </div>

                    {mensagem && <p className={styles.sucesso}>{mensagem}</p>}
                    {erro && <p className={styles.erro}>{erro}</p>}

                    <div className={styles.botoes}>
                        <button
                            type="button"
                            className={styles.buttonCancelar}
                            onClick={() => navigate("/login")}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.buttonConfirmar}
                            disabled={carregando}
                        >
                            {carregando ? "Aguarde..." : "Mudar a senha"}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default RedefinirSenha;