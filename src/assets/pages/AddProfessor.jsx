import { useState, useRef } from "react";
import Headerlogado from "../components/Headerlogado.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/AddProfessor.module.css";
import {Link} from "react-router-dom";

function AddProfessor() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
    });
    const [foto, setFoto] = useState(null);
    const [fotoNome, setFotoNome] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleFoto(e) {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setFotoNome(file.name);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!form.nome || !form.email || !form.senha) {
            setErro("Nome, e-mail e senha são obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("nome", form.nome);
            formData.append("email", form.email);
            formData.append("telefone", form.telefone);
            formData.append("senha", form.senha);
            formData.append("id_cargo", 2);
            if (foto) formData.append("foto", foto);

            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/criar_usuario", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                setErro(data.erro || "Erro ao cadastrar professor.");
            } else {
                setSucesso("Professor cadastrado com sucesso!");
                setForm({ nome: "", email: "", telefone: "", senha: "" });
                setFoto(null);
                setFotoNome("");
            }
        } catch {
            setErro("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    function handleCancelar() {
        setForm({ nome: "", email: "", telefone: "", senha: "" });
        setFoto(null);
        setFotoNome("");
        setErro("");
        setSucesso("");
    }

    return (
        <div>
            <Headerlogado />
            <main>
                <div className={styles.container}>
                    <div className={styles.formulario}>
                        <h1>Adicionar Professor</h1>

                        {erro && <p className={styles.erro}>{erro}</p>}
                        {sucesso && <p className={styles.sucesso}>{sucesso}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.campo}>
                                <label>Nome:</label>
                                <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Digite o nome" />
                            </div>
                            <div className={styles.campo}>
                                <label>Email:</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Digite o email" />
                            </div>
                            <div className={styles.campo}>
                                <label>Telefone:</label>
                                <input maxLength={11} type="tel" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Digite o telefone" />
                            </div>
                            <div className={styles.campo}>
                                <label>Senha:</label>
                                <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Digite a senha" />
                            </div>
                            <div className={styles.campo}>
                                <label>Ícone de perfil:</label>
                                <div className={styles.fileLabel} onClick={() => fileRef.current.click()}>
                                    <span>{fotoNome || "Carregar imagem"}</span>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} />
                            </div>

                            <div className={styles.botao}>
                                <Link to="/VisualizarUsuarios">
                                    <button type="button" className={styles.cancelar}>
                                        Cancelar
                                    </button>
                                </Link>
                                <button className={styles.buttonn} type="submit" disabled={loading}>
                                    {loading ? "Cadastrando..." : "Cadastrar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AddProfessor;