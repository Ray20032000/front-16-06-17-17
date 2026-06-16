import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./../styles/EditarChamado.module.css";
import HeaderLogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";

function EditarChamado() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [patrimonio, setPatrimonio] = useState("");
    const [sala, setSala] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagemArquivo, setImagemArquivo] = useState(null);
    const [imagemNome, setImagemNome] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [mensagem, setMensagem] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/chamado/${id}`, { headers })
            .then(r => r.json())
            .then(data => {
                setPatrimonio(data.patrimonio || "");
                setSala(data.sala || "");
                setDescricao(data.descricao || "");
                if (data.imagem) setImagemNome(data.imagem.split("/").pop());
            })
            .catch(() => setErro("Erro ao carregar chamado."));
    }, [id]);

    function handleImagemClick() {
        fileInputRef.current.click();
    }

    function handleImagemChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImagemArquivo(file);
        setImagemNome(file.name);
    }

    async function handleEditar() {
        if (!patrimonio.trim() || !sala.trim() || !descricao.trim()) {
            setErro("Preencha todos os campos obrigatórios.");
            setTimeout(() => setErro(null), 3000);
            return;
        }

        setCarregando(true);
        try {
            const formData = new FormData();
            formData.append("patrimonio", patrimonio);
            formData.append("sala", sala);
            formData.append("descricao", descricao);
            if (imagemArquivo) formData.append("imagem", imagemArquivo);

            const res = await fetch(`http://localhost:5000/chamado/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMensagem("Chamado atualizado com sucesso!");
                setTimeout(() => {
                    setMensagem(null);
                    navigate(-1);
                }, 2000);
            } else {
                setErro(data.erro || "Erro ao atualizar chamado.");
                setTimeout(() => setErro(null), 3000);
            }
        } catch {
            setErro("Erro de conexão.");
            setTimeout(() => setErro(null), 3000);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main>
            <HeaderLogado />
            <div className={styles.pagina}>
                <div className={styles.card}>
                    <h2 className={styles.titulo}>Editar chamada</h2>

                    <div className={styles.campo}>
                        <label className={styles.label}>Patrimônio:</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={patrimonio}
                            onChange={e => setPatrimonio(e.target.value)}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label className={styles.label}>Sala:</label>
                        <select
                            className={styles.input}
                            value={sala}
                            onChange={e => setSala(e.target.value)}
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
                        <label className={styles.label}>Descrição:</label>
                        <textarea
                            className={styles.textarea}
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label className={styles.label}>Imagem do problema:</label>
                        <div className={styles.inputImagem} onClick={handleImagemClick}>
                            <span className={styles.iconeUpload}>⬆</span>
                            <span className={styles.textoImagem}>
                                {imagemNome ? imagemNome : "Mudar imagem"}
                            </span>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImagemChange}
                        />
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}
                    {mensagem && <p className={styles.sucesso}>{mensagem}</p>}

                    <div className={styles.acoes}>
                        <button className={styles.btnCancelar} onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                        <button
                            className={styles.btnEditar}
                            onClick={handleEditar}
                            disabled={carregando}
                        >
                            {carregando ? "Salvando..." : "Editar"}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default EditarChamado;