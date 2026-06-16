import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/EditarPerfil.module.css";
import HeaderLogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";

function EditarPerfil() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [usuario, setUsuario] = useState(() => {
        const dados = localStorage.getItem("usuario");
        return dados ? JSON.parse(dados) : null;
    });

    const token = localStorage.getItem("token");

    const fotoUrl = usuario
        ? `http://localhost:5000/uploads/usuarios/perfil_${usuario.id_usuario}.jpg`
        : null;

    const [fotoAtual, setFotoAtual] = useState(fotoUrl);
    const [fotoArquivo, setFotoArquivo] = useState(null);
    const [nome, setNome] = useState(usuario?.nome || "");
    const [email, setEmail] = useState(usuario?.email || "");
    const [telefone, setTelefone] = useState(usuario?.telefone || "");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [mensagem, setMensagem] = useState(null);

    function handleFotoClick() {
        fileInputRef.current.click();
    }

    function handleFotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setFotoArquivo(file);
        setFotoAtual(URL.createObjectURL(file));
    }

    async function handleEditar() {
        if (!nome.trim()) {
            setErro("O nome não pode estar vazio.");
            setTimeout(() => setErro(null), 3000);
            return;
        }

        setCarregando(true);

        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("email", email);
            formData.append("telefone", telefone);
            if (fotoArquivo) formData.append("foto", fotoArquivo);

            const res = await fetch(`http://localhost:5000/editar_usuario/${usuario.id_usuario}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                const usuarioAtualizado = { ...usuario, nome, email, telefone };
                localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
                setUsuario(usuarioAtualizado);
                setMensagem("Perfil atualizado com sucesso!");
                setTimeout(() => {
                    setMensagem(null);
                    navigate("/perfil");
                }, 2000);
            } else {
                setErro(data.erro || "Erro ao atualizar perfil.");
                setTimeout(() => setErro(null), 3000);
            }
        } catch {
            setErro("Erro de conexão.");
            setTimeout(() => setErro(null), 3000);
        } finally {
            setCarregando(false);
        }
    }

    if (!usuario) {
        navigate("/");
        return null;
    }

    return (
        <main>
            <HeaderLogado />
            <div className={styles.pagina}>
                <div className={styles.card}>
                    <h2 className={styles.titulo}>Editar perfil</h2>

                    <div className={styles.fotoWrapper}>
                        <img
                            src={fotoAtual}
                            alt="Foto de perfil"
                            className={styles.foto}
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=cccccc&color=666666&size=200`;
                            }}
                        />
                        <button className={styles.btnCarregarImagem} onClick={handleFotoClick}>
                            ⬆ Carregar Imagem
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFotoChange}
                        />
                    </div>

                    <div className={styles.campos}>
                        <div className={styles.campo}>
                            <label className={styles.label}>Nome:</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.campo}>
                            <label className={styles.label}>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.campo}>
                            <label className={styles.label}>Telefone:</label>
                            <input
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}
                    {mensagem && <p className={styles.sucesso}>{mensagem}</p>}

                    <div className={styles.acoes}>
                        <button className={styles.btnCancelar} onClick={() => navigate("/perfil")}>
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

export default EditarPerfil;