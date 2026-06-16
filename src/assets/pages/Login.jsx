import { useState } from "react";
import { Link } from "react-router-dom";
import "./../../global.css";
import styles from "./../styles/Login.module.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function entrar() {

        try {

            // ✅ CORREÇÃO: separar o res do json()
            const res = await fetch("http://127.0.0.1:5000/login_usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    senha: senha,
                })
            });

            const resposta = await res.json();

            console.log("RESPOSTA:", resposta);
            console.log("TOKEN:", resposta.token); // ✅ Verifique aqui no console

            if (res.ok && resposta.usuario) {

                localStorage.setItem("usuario", JSON.stringify(resposta.usuario));
                localStorage.setItem("logado", true);
                // ✅ CORREÇÃO: garante que o token existe antes de salvar
                if (resposta.token) {
                    localStorage.setItem("token", resposta.token);
                } else {
                    setErro("Erro: token não recebido do servidor.");
                    return;
                }

                const tipo = resposta.usuario.tipo;

                if (tipo === "ADMIN") {
                    window.location.href = "/DashboardAdmin";
                } else {
                    window.location.href = "/Dashboard";
                }

            } else {

                setErro(resposta.erro || "Erro ao fazer login");

            }

        } catch (err) {

            console.error("ERRO COMPLETO:", err);
            setErro("Erro ao conectar com a API");

        }
    }

    return (
        <div>

            <Header />

            <div className={styles.countainer}>

                <form
                    className={styles.formulinho}
                    onSubmit={(e) => {
                        e.preventDefault();
                        entrar();
                    }}
                >

                    <h1 className={styles.titulo}>Logar</h1>

                    <div className={styles.formulario}>

                        <div className={styles.campo}>
                            <label>Email:</label>

                            <input
                                name="email"
                                placeholder="Digite seu email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={styles.campo}>
                            <label>Senha:</label>

                            <input
                                name="senha"
                                placeholder="Digite sua senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>

                    </div>

                    {erro && (
                        <p>{erro}</p>
                    )}

                    <div className={styles.botao}>

                        <Link to="/">
                            <button
                                className={styles.cancelar}
                                type="button"
                            >
                                Cancelar
                            </button>
                        </Link>

                        <button
                            className={styles.buttonn}
                            type="submit"
                        >
                            Entrar
                        </button>

                        <Link
                            className={styles.esqueci}
                            to="/EsqueciSenha"
                        >
                            Esqueci minha senha
                        </Link>

                    </div>

                </form>

            </div>

            <Footer />

        </div>
    );
}

export default Login;