document.addEventListener('DOMContentLoaded', function() {
    
    const formulario = document.getElementById('form-evento');
    const menuLateral = document.getElementById('evento-menu');
    const areaDosEventos = document.querySelector('.events-track');

    // --- INICIAR A BASE DE DADOS ---
    initDB().then(function() {
        desenharEventosNoEcra();
    });


    // --- DESENHAR OS EVENTOS ---
    function desenharEventosNoEcra() {
        carregarEventosDB().then(function(listaDeEventos) {
            let htmlParaMostrar = ""

            listaDeEventos.forEach(function(evento) {
                htmlParaMostrar += `
                    <article class="card event-card">
                        <div class="card-image"><img src="media/evento1.png" alt="Evento"></div>
                        <div class="event-card-actions">
                            <button class="event-action-btn botao-editar" data-id="${evento.id}">Editar</button>
                            <button class="event-action-btn botao-apagar" data-id="${evento.id}">Apagar</button>
                        </div>
                        <div class="card-content">
                            <h4>${evento.nome}</h4>
                            <p class="meta">🕒 ${evento.hora} | 📍 ${evento.local}</p>
                        </div>
                    </article>
                `
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