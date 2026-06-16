import { useState } from "react";
import { Link } from "react-router-dom";
import "./../../global.css";
import styles from "./../styles/Cadastro.module.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function Cadastro() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function cadastrar(e) {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("nome", nome);
            formData.append("email", email);
            formData.append("telefone", telefone);
            formData.append("senha", senha);

            const resposta = await fetch("http://localhost:5000/criar_usuario", {
                method: "POST",
                body: formData
            });

            const text = await resposta.text();
            console.log(text);

            const data = JSON.parse(text);

            console.log(data);

            if (resposta.ok) {
                setSucesso(data.mensagem);
                setErro("");

                localStorage.setItem("id_usuario", data.id_usuario);
                window.location.href = "/Confirmar";

            } else {
                setErro(data.erro);
                setSucesso("");
            }

        } catch (err) {
            console.log(err);
            setErro("Erro ao conectar com a API");
        }
    }

    return (
        <div>
            <Header />

            <div className={styles.container}>

                <form className={styles.formulario} onSubmit={cadastrar}>

                    <h1>Cadastrar-se</h1>

                    <div className={styles.campo}>
                        <label>Nome:</label>
                        <input
                            placeholder="Digite seu nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Email:</label>
                        <input
                            placeholder="Digite seu email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Telefone:</label>
                        <input
                            placeholder="Digite seu telefone"
                            type="tel"
                            value={telefone}
                            maxLength={11}
                            required
                            onChange={(e) => {
                                const apenasNumeros = e.target.value.replace(/\D/g, "");
                                setTelefone(apenasNumeros);
                            }}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Senha:</label>
                        <input
                            placeholder="Digite sua senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    <p className={styles.fortin}>*Use uma senha forte</p>

                    <div className={styles.campo}>
                        <label>Foto:</label>
                        <input type="file" accept="image/*" />
                    </div>

                    {erro && <p>{erro}</p>}
                    {sucesso && <p>{sucesso}</p>}

                    <div className={styles.botao}>
                        <Link to="/">
                            <button type="button" className={styles.cancelar}>
                                Cancelar
                            </button>
                        </Link>

                        <button type="submit" className={styles.buttonn}>
                            Cadastrar
                        </button>
                    </div>
                    <Link className={styles.verificar} to="/PedeEmail">
                        Verificar Email
                    </Link>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default Cadastro;