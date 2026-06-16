import { useState, useEffect } from "react"; // importa os hooks do React
import { useNavigate } from "react-router-dom"; // importa a função de navegação entre páginas
import styles from "../styles/TabelaChamado.module.css"; // importa o arquivo de estilos

function TabelaChamado() {

    const navigate = useNavigate(); // permite navegar entre páginas
    const [chamados, setChamados] = useState([]); // armazena a lista de chamados
    const [busca, setBusca] = useState(""); // armazena o texto digitado na pesquisa

    useEffect(() => { // executa toda vez que 'busca' mudar

        // manda o texto da busca como parâmetro na URL
        // ex: http://localhost:5000/chamados?busca=sala01
        // credentials: "include" envia o cookie HttpOnly "token" automaticamente
        fetch(`http://localhost:5000/chamados?busca=${busca}`, {
            credentials: "include"
        })
            .then((r) => r.json())

            // salva os chamados recebidos
            .then((data) => setChamados(Array.isArray(data) ? data : []));

    }, [busca]); // ← roda de novo toda vez que o usuário digitar algo


    const fmt = (d) => {    // formata a data para o padrão brasileiro
        if (!d) return "";
        const dt = new Date(d);
        return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`;
    };

    return (

        // container principal
        <div className={styles.wrapper}>

            {/* barra superior */}
            <div className={styles.topBar}>

                {/* botão para criar novo chamado */}
                <button
                    className={styles.btnNovo}
                    onClick={() => navigate("/NovoChamado")}
                >
                    + Novo chamado
                </button>

                {/* campo de pesquisa */}
                <div className={styles.buscaWrap}>
                    <input
                        placeholder="Pesquisar 🔍"
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        // toda vez que o usuário digita algo:
                        // e = o evento do teclado
                        // e.target = o input em si
                        // e.target.value = o texto atual dentro do input
                        // setBusca(...) = atualiza a variável 'busca' com esse texto
                    />
                </div>
            </div>

            {/* lista de chamados — agora usa 'chamados' direto, o filtro é feito no backend */}
            {chamados.map((c) => (

                <div
                    key={c.id_chamado}
                    className={styles.card}
                >

                    {/* cabeçalho do card */}
                    <div className={styles.cardHead}>

                        {/* informações do chamado */}
                        <div className={styles.infos}>
                            <p><b>Patrimônio:</b> {c.patrimonio}</p>
                            <p><b>Status atual:</b> {c.status}</p>
                            <p><b>Sala:</b> {c.sala}</p>
                            <p><b>Descrição:</b> {c.descricao}</p>
                        </div>

                        {/* data de abertura */}
                        <span className={styles.data}>
                            {fmt(c.data_abertura)}
                        </span>
                    </div>

                    {/* rodapé do card */}
                    <div className={styles.foot}>

                        {/* abre a página de detalhes */}
                        <button
                            onClick={() => navigate(`/chamado/${c.id_chamado}`)}
                        >
                            Ver mais &gt;
                        </button>

                    </div>
                </div>
            ))}
        </div>
    );
}

// exporta o componente
export default TabelaChamado;