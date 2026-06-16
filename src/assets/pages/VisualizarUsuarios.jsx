import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/VisualizarUsuarios.module.css";
import { Link } from "react-router-dom";

function VisualizarUsuarios() {

    const [usuarios, setUsuarios] = useState([]); // lista de usuários
    const [busca, setBusca] = useState(""); // texto digitado na pesquisa
    const [erro, setErro] = useState(""); // mensagem de erro
    const navigate = useNavigate();

    useEffect(() => {
        buscarUsuarios(); // carrega os usuários quando a página abre
    }, []);

    async function buscarUsuarios(nome = "") {
        try {
            const token = localStorage.getItem("token");

            // se tiver texto na busca, usa a rota de pesquisa do backend
            // se não, traz todos os usuários
            const url = nome
                ? `http://localhost:5000/admin/buscar_nome?nome=${nome}`
                : "http://localhost:5000/usuarios";

            const resp = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await resp.json();

            if (resp.ok) {
                setUsuarios(data); // salva os usuários retornados
            } else {
                setErro(data.erro); // mostra o erro retornado pelo backend
            }

        } catch {
            setErro("Erro ao conectar com a API");
        }
    }

    // toda vez que o usuário digita, manda a busca pro backend
    function handleBusca(e) {
        setBusca(e.target.value);
        buscarUsuarios(e.target.value);
    }

    async function bloquear(id) {
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:5000/admin/bloquear/${id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) buscarUsuarios(busca); // atualiza a lista após bloquear
    }

    async function desbloquear(id) {
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:5000/admin/desbloquear/${id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) buscarUsuarios(busca); // atualiza a lista após desbloquear
    }

    async function excluir(id) {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:5000/excluir_usuario/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) buscarUsuarios(busca); // atualiza a lista após excluir
    }

    return (
        <div>
            <HeaderLogado />

            <div className={styles.container}>
                <div className={styles.topo}>
                    <h1>Usuários</h1>
                    <button className={styles.voltar} onClick={() => navigate("/DashboardAdmin")}>
                        Voltar
                    </button>
                </div>

                <p className={styles.subtitulo}>Gerencie os usuários cadastrados no sistema</p>

                {erro && <p className={styles.erro}>{erro}</p>}

                {/* campo de busca — filtra no backend a cada letra digitada */}
                <div className={styles.barraBusca}>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={busca}
                        onChange={handleBusca}
                    />
                </div>

                <Link to="/AddProfessor">
                    <button className={styles.voltar}>+Add Professor</button>
                </Link>

                <Link to="/AddAdmin">
                    <button className={styles.voltar}>+Add Admin</button>
                </Link>

                <table className={styles.tabela}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id_usuario}>

                            {/* ID com zeros à esquerda: ex: 001, 002 */}
                            <td>{String(u.id_usuario).padStart(3, "0")}</td>

                            {/* foto + nome */}
                            <td className={styles.nomeCell}>
                                <img
                                    src={`http://localhost:5000/uploads/usuarios/perfil_${u.id_usuario}.jpg`}
                                    alt="foto"
                                    className={styles.avatar}
                                    onError={(e) => {
                                        // se não tiver foto, gera uma com as iniciais do nome
                                        e.target.src = `https://ui-avatars.com/api/?name=${u.nome}&background=1a3a8f&color=fff`;
                                    }}
                                />
                                {u.nome}
                            </td>

                            <td>{u.email}</td>

                            {/* badge colorida de cargo */}
                            <td>
                                    <span className={u.cargo === "ADMIN" ? styles.admin : styles.professor}>
                                        {u.cargo}
                                    </span>
                            </td>

                            {/* botões de ação */}
                            <td className={styles.acoes}>

                                <button
                                    className={styles.btnEditar}
                                    onClick={() => navigate(`/admin/editar-usuario/${u.id_usuario}`)}
                                    title="Editar"
                                >
                                    ✏️
                                </button>

                                {/* se bloqueado mostra cadeado fechado (desbloquear), senão aberto (bloquear) */}
                                {u.bloqueado ? (
                                    <button
                                        className={styles.btnDesbloquear}
                                        onClick={() => desbloquear(u.id_usuario)}
                                        title="Desbloquear"
                                    >
                                        🔒
                                    </button>
                                ) : (
                                    <button
                                        className={styles.btnBloquear}
                                        onClick={() => bloquear(u.id_usuario)}
                                        title="Bloquear"
                                    >
                                        🔓
                                    </button>
                                )}

                                <button
                                    className={styles.btnExcluir}
                                    onClick={() => excluir(u.id_usuario)}
                                    title="Excluir"
                                >
                                    🗑️
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Footer />
        </div>
    );
}

export default VisualizarUsuarios;