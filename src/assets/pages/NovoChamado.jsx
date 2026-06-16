import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headerlogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/NovoChamada.module.css";

function NovoChamado() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ patrimonio: "", sala: "", descricao: "" });
    const [imagem, setImagem] = useState(null);
    const [erro, setErro] = useState("");

    const handleSubmit = async () => {
        if (!form.patrimonio.trim() || !form.sala || !form.descricao) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        // ✅ CORREÇÃO: busca o token salvo no localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            setErro("Você precisa estar logado.");
            return;
        }

        const formData = new FormData();
        formData.append("patrimonio", form.patrimonio);
        formData.append("sala", form.sala);
        formData.append("descricao", form.descricao);

        if (imagem) {
            formData.append("imagem", imagem);
        }

        try {
            const res = await fetch("http://localhost:5000/criar_chamado", {
                method: "POST",
                headers: {
                    token: token  // ✅ token agora está definido
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                if (usuario?.tipo === "ADMIN") {
                    navigate("/DashboardAdmin");
                } else {
                    navigate("/Dashboard");
                }
            } else {
                setErro(data.erro || "Erro ao criar chamado.");
            }
        } catch (e) {
            // ✅ CORREÇÃO: trata erro de rede ou falha no fetch
            setErro("Erro de conexão com o servidor.");
        }
    };

    return (
        <div>
            <Headerlogado />

            <div className={styles.container}>
                <h1 className={styles.titulo}>Crie uma chamada</h1>

                <div className={styles.campo}>
                    <label>Patrimônio:</label>
                    <input
                        type="text"
                        placeholder="Digite o código do patrimônio"
                        value={form.patrimonio}
                        onChange={(e) => setForm({ ...form, patrimonio: e.target.value })}
                    />
                </div>

                <div className={styles.campo}>
                    <label>Sala:</label>
                    <select
                        className={styles.seleciona}
                        value={form.sala}
                        onChange={(e) => setForm({ ...form, sala: e.target.value })}
                    >
                        <option value="">Selecione a sala</option>
                        <option value="sala1">Sala 01</option>
                        <option value="sala2">Sala 02</option>
                        <option value="sala3">Sala 03</option>
                        <option value="sala4">Sala 04</option>
                        <option value="sala5">Sala 05</option>
                        <option value="sala6">Sala 06</option>
                        <option value="sala7">Sala 07</option>
                        <option value="sala8">Sala 08</option>
                        <option value="sala9">Sala 09</option>
                        <option value="sala10">Sala 10</option>
                        <option value="laboratorioinformatica1">Laboratorio de Informática 1</option>
                        <option value="laboratorioinformatica2">Laboratorio de Informática 2</option>
                    </select>
                </div>

                <div className={styles.campo}>
                    <label>Descrição:</label>
                    <textarea
                        placeholder="Descreva o problema"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    />
                </div>

                <div className={styles.campo}>
                    <label>Imagem do problema:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagem(e.target.files[0])}
                    />
                </div>

                {erro && <p className={styles.erro}>{erro}</p>}

                <div className={styles.botoes}>
                    <button
                        className={styles.btnCancelar}
                        onClick={() => {
                            const usuario = JSON.parse(localStorage.getItem("usuario"));
                            navigate(usuario?.tipo === "ADMIN" ? "/dashboardadmin" : "/dashboard");
                        }}
                    >
                        Cancelar
                    </button>
                    <button className={styles.btnAdicionar} onClick={handleSubmit}>
                        Adicionar
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default NovoChamado;