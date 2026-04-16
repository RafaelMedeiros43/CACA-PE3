document.addEventListener('DOMContentLoaded', async () => {
    
    const areaNoticias = document.getElementById('noticias-dinamicas')
    if (!areaNoticias) return

    try {
       
        const API_KEY = CONFIG.GNEWS_API_KEY
        const url = `https://gnews.io/api/v4/search?q=saúde&country=pt&max=3&apikey=${API_KEY}`

        const resposta = await fetch(url)
        const dados = await resposta.json()

        if (dados.articles && dados.articles.length > 0) {
            
            let htmlParaMostrar = ''

            dados.articles.forEach(noticia => {
                
               
                const imagemEscolhida = noticia.image
                const linkDaNoticia = noticia.url
                const titulo = noticia.title
                let tituloFinal = titulo
                if (titulo.length > 75) {
                    tituloFinal = titulo.substring(0, 75) + '...'
                }

                htmlParaMostrar += `
                    <article class="news-card">
                        <div class="card-image">
                            <img src="${imagemEscolhida}" alt="Notícia">
                        </div>
                        <div class="news-title">
                            <h4>${tituloFinal}</h4>
                        </div>
                        <a href="${linkDaNoticia}" target="_blank" class="link-blue">Ler artigo completo</a>
                    </article> `
            })

            areaNoticias.innerHTML = htmlParaMostrar
            
        } else {
            areaNoticias.innerHTML = '<p>Não foi possível carregar as notícias de saúde de momento.</p>'
        }

    } catch (erro) {
        areaNoticias.innerHTML = '<p>Erro ao ligar ao servidor de notícias.</p>'
    }
})