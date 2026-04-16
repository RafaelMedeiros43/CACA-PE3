PEI 3
Bacar Silla: 2023112223
Manuel Santos: 2023110848
Rafael Medeiros: 2024109280

Descrição do Projeto:
    O nosso projeto consiste num site dinamico e interativo focado na área da saúde.
    - É possivel fazer a gestão de eventos, com a informação do tempo no local do evento, que são armazenados localmente usando o IndexedDB
    - É possivel subscrever à newsletter sendo os dados guardados localmente no IndexedDB, sendo que se o email da pessoa já estiver armazenado, aparece mensagem de erro
    - Aparece localização dos eventos e do CACA no mapa 



 Instruções para configurar e executar a aplicação localmente:
    Para usar o site localmente, é necessario fazer download ou clonar o repositorio do github.
    Para ter acesso às funcionalidades que envolvem APIs é necessário trocar a variavel das APIs no ficheiro config.example, encontrado na pasta JavaScript, basta trocar cada variável pela respetiva API, de seguida é necessário ir onde essas variaveis são chamadas e trocar o caminho delas,
    de CONFIG.WEATHER_API_KEY para CONFIG.EXAMPLE.WEATHER_API_KEY e o mesmo para outras APIS
    Depois disso basta abrir o index.html ou entao usar a extensão live server pra abrir o site no browser.
    Para adicionar eventos é preciso ligar o modo admin, que é feito através de um botão escondido no simbolo do copyright no footer.
    De seguida, ir pra área dos eventos e adicionar os eventos desejados, inserindo nome, data e local.


Explicação da arquitetura de dados da IndexedDB:
    O nosso projeto usa o IndexedDB para armazenar dados diretamente no browser do utilizador, guardando informações após a saída do utilizador do site.
    Existe uma base de dados chamada CacaDB onde existe 2 tabelas, uma delas serve pra guardar os eventos, permitindo aplicar o CRUD, sendo assim,
    é possivel criar, editar, ler e apagar eventos consoante seja necessário. A outra tabela que existe é a tabela de subscritores da nossa newsletter, permitindo guardar informações da pessoa que se inscreveu, impedindo que um mesmo email seja utilizado mais que uma vez.

    Para a tabela dos eventos a chave principal é o id, que é incremementado de forma automática assim que um novo evento é adicionado. 
    São armazenados em objetos, contento um par chave-valor, tendo informações como o nome, data, hora, local e descrição do evento
    Para a tabela dos subscritores a chave principal é o email da pessoa, não permitindo assim emails duplicados.
    Assim como a tabela dos eventos, são armazenados em objetos com par chave-valor, contendo o email, nome, indicativo do país, numero de telémovel e a mensagem que mandaram.

    Para garantir que o site não fique lento enquanto comunicamos com a base de dados, todas as funções de manipulação de dados foram construídas utilizando Promises. Isto permite que o JavaScript execute outras tarefas.

    Como que as funções comunicam com o site:
        initDB(): Antes de qualquer clique, esta função devolve uma promessa que, ao ser concluida, garante que a base de dados está aberta e as tabelas prontas a usar.

        adicionarEventoDB(evento): Quando o formulário é submetido, esta função cria uma promessa. O site só limpa o formulário e fecha o menu dos eventos quando a base de dados confirma que o evento foi gravado com sucesso.

        carregarEventosDB(): Esta é a função de leitura. Ela devolve uma promessa contendo a lista de todos os objetos guardados. O site espera por esta resposta para mostrar os eventos.

        atualizarEventoDB(evento): Funciona de forma semelhante à adição, mas utiliza o ID do evento para encontrar o objeto correto e substituir os valores antigos pelos novos. A interface só atualiza a lista após a confirmação desta promessa.

        removerEventoDB(id): Envia um pedido para apagar um registo específico. Assim que a promessa é resolvida, o JavaScript faz automaticamente um novo desenho do ecrã para remover o cartão visualmente.

        adicionarSubscritorDB(subscritor): É a única função que gere dois estados ao mesmo tempo:
            Sucesso (resolve): O e-mail é novo e foi guardado.

            Erro (reject): O e-mail já existe na base de dados. O site usa esta resposta negativa para mostrar um aviso vermelho ao utilizador.


Descrição das APIs externas utilizadas e como foram integradas:
    O nosso projeto utiliza 3 APIs, é utilizada a API do Open Weather Map, Gnews e

    API do Open Weather Map:
        É usada em conjunto com os nossos eventos, mostrando uma previsão do tempo para o local de cada evento.
        Para cada evento presente na base de dados, o sistema pega no campo local e o ficheiro eventos.js comunica com a API do tempo passando essa cidade como parâmetro devolvendo um objeto com todas as informaçoes do tempo desse local.
        Para os ícones, em vez de ter diversos simbolos ou emojis no nosso código, nós optamos por pegar no simbolo que ja vem com a API, devolvendo um código como por exemplo "01d". O nosso código converte esse código num URL de imagem oficial do OpenWeather, colocando o ícone correspondente diretamente no cartão do evento.

    API do Gnews:
        É usada para transmitir notícias reais ao utilizador sobre o ambiente da saúde em Porgugal.
        O ficheiro noticias.js realiza um pedido à API da GNews, filtrando pelas palavras-chave saúde e Portugal com limite de 3 resultados.
        Como os títulos da API podem ser muito extensos, implementámos uma lógica de truncagem podendo ter no máximo 75 caracteres para manter a integridade do design dos cartões.
