import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/HeaderLogado.module.css";

function HeaderLogado() {
    const usuario = useState(() => {
        const dados = localStorage.getItem("usuario");
        return dados ? JSON.parse(dados) : null;
    })[0];

    const navigate = useNavigate();

    async function logout() {
        await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include"
        });
        localStorage.clear();
        navigate("/");
    }

    const fotoUrl = usuario
        ? `http://localhost:5000/uploads/usuarios/perfil_${usuario.id_usuario}.jpg`
        : null;

    return (

        <header className={styles.fundo}>

            <img
                className={styles.logo}
                src="/icon.png"
                alt="Logo ReportaAí"
            />

            {usuario && (

                <div className={styles.perfil}>

                    <img
                        src={fotoUrl}
                        alt="foto"
                        onClick={() => navigate("/Perfil")}
                        title="Ver perfil"
                        className={styles.fotoPerfil}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${usuario.nome}&background=1a3a8f&color=fff`;

                        }}

                    />

                    <button onClick={logout} className={styles.logout}>

                        ➜

                    </button>

                </div>

            )}

        </header>

    ); }

export default HeaderLogado;