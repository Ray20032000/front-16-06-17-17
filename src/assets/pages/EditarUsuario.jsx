import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Headerlogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/EditarUsuario.module.css";

function EditarUsuarioAdmin() {
    const { id_usuario } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [foto, setFoto] = useState(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    useEffect(() => {
        if (usuario?.tipo !== "ADMIN") {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (!id_usuario) return;

        fetch(`http://localhost:5000/admin/buscar_nome?nome=`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((lista) => {
                const encontrado = lista.find(
                    (u) => u.id_usuario === parseInt(id_usuario)
                );
                if (encontrado) {
                    setNome(encontrado.nome);
                    setEmail(encontrado.email);
                }
            })
            .catch(() => setErro("Erro ao carregar dados do usuário."));
    }, [id_usuario]);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!nome.trim()) {
            setErro("O nome é obrigatório.");
            return;
        }

        setCarregando(true);

        const formData = new FormData();
        formData.append("nome", nome);
        if (senha) formData.append("senha", senha);
        if (foto) formData.append("foto", foto);

        try {
            const res = await fetch(
                `http://localhost:5000/editar_usuario/${id_usuario}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setErro(data.erro || "Erro ao atualizar.");
            } else {
                setSucesso("Usuário atualizado com sucesso!");
                setTimeout(() => navigate("/admin/usuarios"), 1500);
            }
        } catch {
            setErro("Erro de conexão com o servidor.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className={styles.pagina}>
            <Headerlogado />
            <main>
                <form className={styles.formulario} onSubmit={handleSubmit}>
                    <h1 className={styles.titulo}>Editar Usuário</h1>

                    <div className={styles.campo}>
                        <label>Nome:</label>
                        <input
                            placeholder="Digite o nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Nova Senha:</label>
                        <p className={styles.op}>(opcional)</p>
                        <input
                            placeholder="Deixe em branco para não alterar"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    <p className={styles.fortin}>*Use uma senha forte</p>

                    <div className={styles.campo}>
                        <label>Foto:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFoto(e.target.files[0])}
                        />
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}
                    {sucesso && <p className={styles.sucesso}>{sucesso}</p>}

                    <div className={styles.botao}>
                        <Link to="/admin/usuarios">
                            <button type="button" className={styles.cancelar}>
                                Cancelar
                            </button>
                        </Link>

                        <button
                            type="submit"
                            className={styles.buttonn}
                            disabled={carregando}
                        >
                            {carregando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default EditarUsuarioAdmin;