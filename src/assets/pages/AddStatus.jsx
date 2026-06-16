import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Headerlogado from "../components/Headerlogado.jsx";
import styles from "./../styles/AddStatus.module.css";

function AddStatus() {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const handleCadastrar = async () => {
        setErro("");
        setSucesso("");

        if (!nome.trim()) {
            setErro("Digite um nome para o status.");
            return;
        }

        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/admin/criar_status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nome }),
        });

        const data = await res.json();
        if (res.ok) {
            setSucesso("Status cadastrado com sucesso!");
            setNome("");
            setTimeout(() => navigate("/DashboardAdmin"), 1500);
        } else {
            setErro(data.erro || "Erro ao cadastrar status.");
        }
    };

    return (
        <div>
            <Headerlogado />

            <div className={styles.countainer}>
                <h1>Adicionar Status</h1>

                <div className={styles.formulario}>
                    <div className={styles.pergunta}>
                        <label>Status:</label>
                        <input
                            placeholder="Digite o novo Status"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    {erro && <p style={{ color: "red" }}>{erro}</p>}
                    {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

                    <div className={styles.botao}>
                        <button
                            type="button"
                            className={styles.cancelar}
                            onClick={() => navigate("/DashboardAdmin")}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className={styles.cadastra}
                            onClick={handleCadastrar}
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default AddStatus;