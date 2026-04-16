document.addEventListener('DOMContentLoaded', function() {
    
    const formulario = document.getElementById('form-evento');
    const menuLateral = document.getElementById('evento-menu');
    const areaDosEventos = document.querySelector('.events-track');

    // INICIA A BASE DE DADOS
    initDB().then(function() {
        desenharEventosNoEcra()
    });

    //Auto complete da localização
    const inputLocal = document.getElementById('evento-local');
    const formGroupLocal = inputLocal.parentElement;

    formGroupLocal.style.position = 'relative';

    const listaSugestoes = document.createElement('ul');
    listaSugestoes.className = 'autocomplete-list';
    listaSugestoes.style.display = 'none';
    formGroupLocal.appendChild(listaSugestoes);

    let timeoutPesquisa;

    inputLocal.addEventListener('input', function(){
        clearTimeout(timeoutPesquisa);
        const pesquisa = this.value;

        if (pesquisa.length < 3) {
            listaSugestoes.style.display = 'none';
            return;
        }

        timeoutPesquisa = setTimeout(async () => {
            try {
                
                const resposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pesquisa)}&countrycodes=pt&limit=5`);
                const dados = await resposta.json();

                listaSugestoes.innerHTML = ''; // Limpa as pesquisas antigas

                if (dados.length > 0) {
                    listaSugestoes.style.display = 'block';

                    dados.forEach(local => {
                        const li = document.createElement('li');
                        li.textContent = local.display_name;

                        li.addEventListener('click', () => {
                            inputLocal.value = local.display_name; // Preenche o input
                            listaSugestoes.style.display = 'none'; // Esconde a lista
                        });

                        listaSugestoes.appendChild(li);
                    });
                } else {
                    listaSugestoes.style.display = 'none';
                }
            } catch (erro) {
                console.error("Erro ao procurar sugestões", erro);
            }
        }, 500);
    });

    // Fecha a lista ao clicar noutro sítio
    document.addEventListener('click', function(clique) {
        if (!formGroupLocal.contains(clique.target)) {
            listaSugestoes.style.display = 'none';
        }
    });

    // DESENHA OS EVENTOS
    function desenharEventosNoEcra() {
        carregarEventosDB().then(function(listaDeEventos) {
            let htmlParaMostrar = ""

            listaDeEventos.forEach(function(evento) {
                // Encurta a morada
                let localCurto = evento.local;
                if (localCurto.includes(',')) {
                    localCurto = localCurto.split(',')[0];
                }
                if (localCurto.length > 25) {
                    localCurto = localCurto.substring(0, 22) + '...';
                }

                htmlParaMostrar += `
                <article class="card event-card">
                    <div class="card-image">
                        <img src="media/evento1.png" alt="Evento">
                    </div>

                    <div class="event-card-actions">
                        <button class="event-action-btn botao-editar" data-id="${evento.id}">Editar</button>
                        <button class="event-action-btn botao-apagar" data-id="${evento.id}">Apagar</button>
                    </div>
                    <div class="card-content">
                        <h4>${evento.nome}</h4>

                        <p class="meta">
                            🕒 ${evento.hora} | 📍
                            <span class="local-clicavel" data-id="${evento.id}" data-local="${evento.local}" title="${evento.local}" style="cursor:pointer; text-decoration:underline; color:var(--accent-color1);">
                                ${localCurto}
                            </span>
                        </p>
                        
                        <div id="weather-${evento.id}"></div>
                        
                    </div>
                </article>
            `;
            })

            htmlParaMostrar += `
                <article class="card event-card event-card-add" id="cartao-novo-evento">
                    <div class="event-card-add-content">
                        <div class="event-card-add-icon">+</div>
                        <h4>Adicionar evento</h4>
                    </div>
                </article>
            `

            areaDosEventos.innerHTML = htmlParaMostrar
            atualizarMeteorologiaEventos(listaDeEventos)

            ativarBotoes()
        })
    }

    function ativarBotoes() {
        
        const botaoNovo = document.getElementById('cartao-novo-evento')
        botaoNovo.addEventListener('click', function() {
            formulario.reset();
            document.getElementById('evento-id').value = ""
            document.getElementById('menu-eventos-titulo').textContent = "Novo Evento"
            menuLateral.classList.add('show')
        });

        const botoesApagar = document.querySelectorAll('.botao-apagar')
        botoesApagar.forEach(function(botao) {
            botao.addEventListener('click', function(clique) {
                const idDoEvento = Number(clique.target.getAttribute('data-id'))
                
                removerEventoDB(idDoEvento).then(function() {
                    desenharEventosNoEcra()
                })
            })
        })

        const botoesEditar = document.querySelectorAll('.botao-editar');
        botoesEditar.forEach(function(botao) {
            botao.addEventListener('click', function(clique) {
                const idDoEvento = Number(clique.target.getAttribute('data-id'))

                carregarEventosDB().then(function(listaDeEventos) {
                    const eventoEscolhido = listaDeEventos.find(function(e) { return e.id === idDoEvento; })

                    document.getElementById('evento-id').value = eventoEscolhido.id
                    document.getElementById('evento-nome').value = eventoEscolhido.nome
                    document.getElementById('evento-data').value = eventoEscolhido.data
                    document.getElementById('evento-hora').value = eventoEscolhido.hora
                    document.getElementById('evento-local').value = eventoEscolhido.local
                    document.getElementById('evento-desc').value = eventoEscolhido.desc

                    document.getElementById('menu-eventos-titulo').textContent = "Editar Evento"
                    menuLateral.classList.add('show')
                })
            })
        })

        const botaoLocal = document.querySelectorAll('.botao-local');
        botaoLocal.forEach(function(span){
            span.addEventListener('click', function(clique){
                const local = clique.target.getAttribute('data-local');
                abrirMapaModal(local);
            });
        });

        document.getElementById('fechar-mapa-modal').addEventListener('click', function(){
            document.getElementById('modal-mapa').classList.remove('show');
        });
    }

    formulario.addEventListener('submit', function(e) {
        e.preventDefault()

        const idOculto = document.getElementById('evento-id').value;
        const dadosDoFormulario = {
            nome: document.getElementById('evento-nome').value,
            data: document.getElementById('evento-data').value,
            hora: document.getElementById('evento-hora').value,
            local: document.getElementById('evento-local').value,
            desc: document.getElementById('evento-desc').value
        }

        if (idOculto !== "") {
            dadosDoFormulario.id = Number(idOculto); 
            atualizarEventoDB(dadosDoFormulario).then(function() {
                menuLateral.classList.remove('show');
                desenharEventosNoEcra();
            })
        } else {
            adicionarEventoDB(dadosDoFormulario).then(function() {
                menuLateral.classList.remove('show');
                desenharEventosNoEcra();
            })
        }
    })


    document.getElementById('fechar-menu-eventos').addEventListener('click', function() {
        menuLateral.classList.remove('show')
    })
})