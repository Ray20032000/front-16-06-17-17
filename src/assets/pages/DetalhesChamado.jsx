import { useState, useEffect } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import HeaderLogado from "./../components/Headerlogado.jsx";
import Footer from "./../components/Footer.jsx";
import styles from "./../styles/DetalhesChamado.module.css";

function DetalhesChamado() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [chamado, setChamado] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [responsaveis, setResponsaveis] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [erro, setErro] = useState("");

    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const token = localStorage.getItem("token");
    const isAdmin = usuario?.tipo === "ADMIN";

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetch(`http://localhost:5000/chamado/${id}`, { headers })
            .then(r => r.json())
            .then(data => setChamado(data))
            .catch(() => setErro("Erro ao carregar chamado."));
    }, [id]);


    useEffect(() => {
        fetch(`http://localhost:5000/chamado/${id}/comentarios`, { headers })
            .then(r => r.json())
            .then(data => setComentarios(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, [id]);


    useEffect(() => {
        if (!isAdmin) return;

        fetch("http://localhost:5000/usuarios", { headers })
            .then(r => r.json())
            .then(data => setResponsaveis(Array.isArray(data) ? data : []));

        fetch("http://localhost:5000/status", { headers })
            .then(r => r.json())
            .then(data => setStatusList(Array.isArray(data) ? data : []));
    }, [isAdmin]);

    const handleEnviarComentario = async () => {
        if (!novoComentario.trim()) return;

        const res = await fetch(`http://localhost:5000/chamado/${id}/comentario`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ texto: novoComentario }),
        });

        if (res.ok) {
            const novo = await res.json();
            setComentarios(prev => [...prev, novo]);
            setNovoComentario("");
        }
    };

    const handleStatusChange = async (e) => {
        const novoStatus = e.target.value;
        setChamado(prev => ({ ...prev, status: novoStatus }));

        await fetch(`http://localhost:5000/chamado/${id}/status`, {
            method: "PUT",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus }),
        });
    };

    const handleResponsavelChange = async (e) => {
        const idResponsavel = e.target.value;
        setChamado(prev => ({ ...prev, id_responsavel: idResponsavel }));

        await fetch(`http://localhost:5000/chamado/${id}/responsavel`, {
            method: "PUT",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ id_responsavel: idResponsavel }),
        });
    };

    const handleFinalizar = async () => {
        await fetch(`http://localhost:5000/chamado/${id}/finalizar`, {
            method: "PUT",
            headers,
        });
        navigate(isAdmin ? "/DashboardAdmin" : "/Dashboard");
    };

    const handleExcluir = async () => {
        if (!confirm("Tem certeza que deseja excluir este chamado?")) return;
        await fetch(`http://localhost:5000/chamado/${id}`, {
            method: "DELETE",
            headers,
        });
        navigate(isAdmin ? "/DashboardAdmin" : "/Dashboard");
    };

    if (!chamado) return <div style={{ padding: 40, textAlign: "center" }}>Carregando...</div>;

    const numeroFormatado = `${new Date(chamado.data_abertura).getFullYear()}-${String(chamado.id_chamado).padStart(5, "0")}`;
    const dataFormatada = chamado.data_abertura
        ? new Date(chamado.data_abertura).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        })
        : "";

    return (
        <div>
            <HeaderLogado />

            <div className={styles.container}>
                {/* Cabeçalho */}
                <div className={styles.cabecalho}>
                    <button className={styles.btnVoltar} onClick={() => navigate(-1)}>
                        Voltar
                    </button>
                    <h1>Chamado</h1>
                        <div className={styles.acoesDir}>


                            <button className={styles.btnIcone} title="Editar" onClick={() => navigate(`/EditarChamado/${id}`)}>✏️</button>
                    <button className={styles.btnIcone} title="Excluir" onClick={handleExcluir}>🗑️</button>
                </div>

                </div>

                {erro && <p className={styles.erro}>{erro}</p>}

                {/* Patrimônio */}
                <div className={styles.campo}>
                    <label>Patrimônio:</label>
                    <span>{chamado.patrimonio}{chamado.modelo ? ` - ${chamado.modelo}` : ""}</span>
                </div>

                {/* Status */}
                <div className={styles.campo}>
                    <label>Status atual:</label>
                    {isAdmin ? (
                        <select value={chamado.status || ""} onChange={handleStatusChange}>
                            {statusList.map(s => (
                                <option key={s.id_status} value={s.nome}>{s.nome}</option>
                            ))}
                        </select>
                    ) : (
                        <span>{chamado.status}</span>
                    )}
                </div>

                {/* Sala */}
                <div className={styles.campo}>
                    <label>Sala:</label>
                    <span>{chamado.sala}</span>
                </div>

                {/* Data */}
                <div className={styles.campo}>
                    <label>Data:</label>
                    <span>
                        {chamado.data_abertura
                            ? new Date(chamado.data_abertura).toLocaleDateString("pt-BR")
                            : ""}
                    </span>
                </div>

                {/* Número do chamado */}
                <div className={styles.campo}>
                    <label>Número do chamado:</label>
                    <span>{numeroFormatado}</span>
                </div>

                {/* Responsável — só admin */}
                {isAdmin && (
                    <div className={styles.campo}>
                        <label>Adicionar responsável:</label>
                        <select value={chamado.id_responsavel || ""} onChange={handleResponsavelChange}>
                            <option value="">Sem responsável</option>
                            {responsaveis.map(r => (
                                <option key={r.id_usuario} value={r.id_usuario}>{r.nome}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Descrição */}
                <div className={styles.campo}>
                    <label>Descrição:</label>
                    <span className={styles.descricao}>{chamado.descricao}</span>
                </div>

                {/* Linha imagem + comentários */}
                <div className={styles.linhaInferior}>
                    <div>
                        <div className={styles.campo} style={{ marginBottom: 8 }}>
                            <label>Imagem do problema:</label>
                        </div>
                        {chamado.imagem ? (
                            <img
                                className={styles.imagemProblema}
                                src={`http://localhost:5000/${chamado.imagem}`}
                                alt="Imagem do problema"
                            />
                        ) : (
                            <div className={styles.semImagem}>Sem imagem</div>
                        )}
                    </div>

                    {/* Comentários */}
                    <div className={styles.comentarios}>
                        <div className={styles.comentariosTitulo}>Comentários</div>

                        <div className={styles.listaComentarios}>
                            {comentarios.length === 0 && (
                                <p className={styles.textin}>Nenhum comentário ainda.</p>
                            )}
                            {comentarios.map((c, i) => (
                                <div key={i} className={styles.comentarioItem}>
                                    <div className={styles.comentarioHeader}>
                                        <span>{c.nome_usuario}</span>
                                        <span>{c.data ? new Date(c.data).toLocaleString("pt-BR", {
                                            day: "2-digit", month: "2-digit", year: "2-digit",
                                            hour: "2-digit", minute: "2-digit"
                                        }) : ""}</span>
                                    </div>
                                    <div className={styles.comentarioTexto}>{c.texto}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.inputComentario}>
                            <input
                                type="text"
                                placeholder="Adicionar comentário"
                                value={novoComentario}
                                onChange={e => setNovoComentario(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleEnviarComentario()}
                            />
                            <button className={styles.btnEnviar} onClick={handleEnviarComentario}>▷</button>
                        </div>
                    </div>
                </div>

                {/* Data abertura rodapé */}
                <div className={styles.dataAbertura}>{dataFormatada}</div>

                {/* Botão finalizar — só admin */}
                {isAdmin && (
                    <button className={styles.btnFinalizar} onClick={handleFinalizar}>
                        Finalizar
                    </button>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default DetalhesChamado;
