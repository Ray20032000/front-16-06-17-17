import { useState, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import styles from "./../styles/Perfil.module.css";
import HeaderLogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";

function Perfil() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [usuario, setUsuario] = useState(() => {
        const dados = localStorage.getItem("usuario");
        return dados ? JSON.parse(dados) : null;
    });

    const token = localStorage.getItem("token");

    const [editandoSenha, setEditandoSenha] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState(null);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const fotoUrl = usuario
        ? `http://localhost:5000/uploads/usuarios/perfil_${usuario.id_usuario}.jpg`
        : null;

    const [fotoAtual, setFotoAtual] = useState(fotoUrl);

    function handleFotoClick() {
        fileInputRef.current.click();
    }

    async function handleFotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("nome", usuario.nome);
        formData.append("foto", file);

        try {
            const res = await fetch(`http://localhost:5000/editar_usuario/${usuario.id_usuario}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                const novaUrl = URL.createObjectURL(file);
                setFotoAtual(novaUrl);
                setMensagem("Foto atualizada!");
                setTimeout(() => setMensagem(null), 3000);
            } else {
                const data = await res.json();
                setErro(data.erro || "Erro ao atualizar foto.");
                setTimeout(() => setErro(null), 3000);
            }
        } catch {
            setErro("Erro de conexão.");
            setTimeout(() => setErro(null), 3000);
        }
    }

    async function handleSalvarSenha() {
        if (!novaSenha || !confirmarSenha) {
            setErro("Preencha os dois campos de senha.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);
        try {
            const formData = new FormData();
            formData.append("nome", usuario.nome);
            formData.append("senha", novaSenha);

            const res = await fetch(`http://localhost:5000/editar_usuario/${usuario.id_usuario}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMensagem("Senha alterada com sucesso!");
                setEditandoSenha(false);
                setNovaSenha("");
                setConfirmarSenha("");
                setTimeout(() => setMensagem(null), 3000);
            } else {
                setErro(data.erro || "Erro ao alterar senha.");
            }
        } catch {
            setErro("Erro de conexão.");
        } finally {
            setCarregando(false);
            setTimeout(() => setErro(null), 3000);
        }
    }

    async function handleLogout() {
        await fetch("http://localhost:5000/logout", { method: "POST" });
        localStorage.clear();
        navigate("/");
    }

    if (!usuario) {
        navigate("/");
        return null;
    }

    return (
        <main>
            <HeaderLogado/>
            <div className={styles.pagina}>
                <div className={styles.topo}>
                    <button className={styles.btnVoltar} onClick={() => navigate(-1)}>
                        Voltar
                    </button>
                </div>

                <div className={styles.card}>
                    <Link to={"/EditarPerfil"} className={styles.edita}>
                        ✏️
                    </Link>
                    <div className={styles.fotoWrapper}>
                        <img
                            src={fotoAtual}
                            alt="Foto de perfil"
                            className={styles.foto}
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=1a3a8f&color=fff&size=200`;
                            }}
                        />
                        <button className={styles.btnEditarFoto} onClick={handleFotoClick} title="Alterar foto">
                            ✏️
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFotoChange}
                        />
                    </div>

                    <div className={styles.dados}>
                        <div className={styles.linha}>
                            <span className={styles.label}>Nome:</span>
                            <span className={styles.valor}>{usuario.nome}</span>
                        </div>

                        <div className={styles.linha}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.valor}>{usuario.email || "—"}</span>
                        </div>

                        <div className={styles.linha}>
                            <span className={styles.label}>Senha:</span>
                            {editandoSenha ? (
                                <div className={styles.senhaForm}>
                                    <input
                                        type="password"
                                        placeholder="Nova senha"
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        className={styles.inputSenha}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirmar senha"
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                        className={styles.inputSenha}
                                    />
                                    <div className={styles.senhaAcoes}>
                                        <button
                                            className={styles.btnSalvar}
                                            onClick={handleSalvarSenha}
                                            disabled={carregando}
                                        >
                                            {carregando ? "Salvando..." : "Salvar"}
                                        </button>
                                        <button
                                            className={styles.btnCancelar}
                                            onClick={() => {
                                                setEditandoSenha(false);
                                                setNovaSenha("");
                                                setConfirmarSenha("");
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <span className={styles.valor}>
                                ••••••••••{" "}
                                    <button
                                        className={styles.btnEditarInline}
                                        onClick={() => setEditandoSenha(true)}
                                        title="Alterar senha"
                                    >
                                    ✏️
                                </button>
                            </span>
                            )}
                        </div>

                        <div className={styles.linha}>
                            <span className={styles.label}>Telefone:</span>
                            <span className={styles.valor}>{usuario.telefone || "—"}</span>
                        </div>
                    </div>

                    {mensagem && <p className={styles.sucesso}>{mensagem}</p>}
                    {erro && <p className={styles.erro}>{erro}</p>}
                </div>

                <button className={styles.btnSair} onClick={handleLogout}>
                    Sair da conta
                </button>
            </div>
            <Footer />
        </main>

    );
}

export default Perfil;