import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from "./../styles/Confirmar.module.css";

function Confirmar() {

    const [codigo, setCodigo] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const navigate = useNavigate();

    const id_usuario = localStorage.getItem("id_usuario");
    console.log("id_usuario:", id_usuario); // vê o que aparece no console

    async function confirmarCodigo(e) {
        e.preventDefault();

        const id_usuario = localStorage.getItem("id_usuario");

        if (!id_usuario) {
            setErro("Sessão expirada. Faça o cadastro novamente.");
            return;
        }


        try {
            const resposta = await fetch("http://127.0.0.1:5000/confirmar_codigo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_usuario: id_usuario,
                    codigo: codigo
                })
            });

            const data = await resposta.json();

            if (resposta.ok) {
                setSucesso(data.mensagem);
                setErro("");

                localStorage.removeItem("id_usuario");

                setTimeout(() => {
                    navigate("/Login");
                }, 2000);

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

                <form className={styles.formulario} onSubmit={confirmarCodigo}>
                    <h1 className={styles.titulo}>Verifique o código</h1>
                    <p>Enviamos um e-mail com o código de verificação</p>

                    <div className={styles.campo}>
                        <label>Código</label>
                        <input
                            className={styles.inputin}
                            placeholder="Digite o código"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
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

export default Confirmar;